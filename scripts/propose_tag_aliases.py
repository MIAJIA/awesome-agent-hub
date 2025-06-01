import re
from collections import defaultdict
from pathlib import Path

def get_simple_plural_forms(tag):
    # Returns a set of simple plural forms
    plurals = {tag + "s", tag + "es"}
    if tag.endswith("y"):
        plurals.add(tag[:-1] + "ies")
    return plurals

def get_simple_singular_form(tag):
    # Returns a potential singular form, or the original tag
    if tag.endswith("ies"):
        return tag[:-3] + "y"
    if tag.endswith("es"):
        # More specific checks for -es (e.g., buses, services)
        # For simplicity, just removing -es if it's a common pattern
        # This is highly heuristic
        if len(tag) > 3 and tag[:-2].isalnum(): # Avoid cases like 'os' -> 'o'
             return tag[:-2]
    if tag.endswith("s") and not tag.endswith("ss") and len(tag) > 1:
        return tag[:-1]
    return tag

def generate_tag_aliases(tags_md_file_path, output_ts_file_path):
    raw_tags = []
    try:
        with open(tags_md_file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith("- "):
                    tag = line[2:].lower().strip()
                    if tag:
                        raw_tags.append(tag)
    except FileNotFoundError:
        print(f"Error: Input MD file not found at {tags_md_file_path}")
        return

    unique_tags = sorted(list(set(raw_tags)))

    final_map = {}
    # Mark tags that have been assigned as an alias or have become a primary key
    processed_tags = set()

    # Sort by length to make shorter tags (often base terms) primary candidates first
    sorted_primary_candidates = sorted(unique_tags, key=lambda x: (len(x), x))

    common_prefixes = ["ai-", "llm-", "multi-", "auto-", "gen-", "open-", "web-", "dev-"]
    common_suffixes = [
        "-framework", "-sdk", "-api", "-tool", "-apps", "-app", "-platform", "-model",
        "-models", "-service", "-engine", "-library", "-lib", "-kit", "-stack",
        "-solution", "-metrics", "-eval", "-data", "-db", "-store", "-graph",
        "-os", "-ui", "-cli", "-chain", "-ops", "-runtime", "-server", "-client",
        "-agent", "-agents", "-gpt", "-based", "-driven", "-tech", "-system",
        "-protocol", "-interface", "-net", "-base", "-core", "-manager"
    ]

    for p_candidate in sorted_primary_candidates:
        if p_candidate in processed_tags:
            continue

        current_aliases = []
        # The p_candidate is the potential primary tag (key)

        for o_tag in unique_tags:
            if o_tag == p_candidate or o_tag in processed_tags:
                continue

            is_alias = False

            # 1. Plurality: o_tag is a plural of p_candidate
            if o_tag in get_simple_plural_forms(p_candidate):
                is_alias = True
            # or p_candidate is a plural of o_tag (meaning o_tag should be primary if shorter)
            # This is handled by sorted_primary_candidates where shorter o_tag would have been p_candidate earlier.

            # 2. Prefixes: o_tag = prefix + p_candidate
            if not is_alias:
                for prefix in common_prefixes:
                    if o_tag.startswith(prefix) and o_tag == prefix + p_candidate:
                        is_alias = True
                        break

            # 3. Suffixes: o_tag = p_candidate + suffix
            if not is_alias:
                for suffix in common_suffixes:
                    if o_tag.endswith(suffix) and o_tag == p_candidate + suffix:
                        is_alias = True
                        break

            # 4. Specific known abbreviations (heuristic)
            if not is_alias:
                if (p_candidate == "eval" and o_tag == "evaluation") or \
                   (p_candidate == "nlp" and o_tag == "natural-language-processing") or \
                   (p_candidate == "rag" and o_tag == "retrieval-augmented-generation"):
                    is_alias = True
                # Vice-versa: if p_candidate is "evaluation" and o_tag is "eval"
                # This is handled because "eval" (shorter) would be p_candidate first.

            # 5. Hyphenation vs. combined word: e.g. "llmagent" vs "llm-agent"
            if not is_alias:
                if p_candidate.replace("-", "") == o_tag or o_tag.replace("-", "") == p_candidate:
                    # Prefer hyphenated or shorter as primary, current sort handles shorter.
                    # If p_candidate is 'llm-agent' and o_tag is 'llmagent'
                    if len(p_candidate) >= len(o_tag): # if 'llmagent' is o_tag, it is alias
                         is_alias = True


            if is_alias:
                current_aliases.append(o_tag)

        if current_aliases:
            # Ensure aliases are unique and not the primary candidate itself
            unique_current_aliases = sorted(list(set(alias for alias in current_aliases if alias != p_candidate)))
            if unique_current_aliases:
                final_map[p_candidate] = unique_current_aliases
                processed_tags.add(p_candidate) # Mark primary candidate as processed
                for alias_tag in unique_current_aliases:
                    processed_tags.add(alias_tag) # Mark its aliases as processed

    ts_output_content = "// Generated by script. Please review and refine manually.\n"
    ts_output_content += "// This is a best-effort attempt and may require significant curation.\n"
    ts_output_content += "const tagAliasMap: Record<string, string[]> = {\n"
    for primary, aliases in sorted(final_map.items()):
        alias_str = ", ".join([f'"{a}"' for a in aliases])
        ts_output_content += f'  "{primary}": [{alias_str}],\n'
    ts_output_content += "};\n\nexport default tagAliasMap;\n"

    try:
        with open(output_ts_file_path, 'w', encoding='utf-8') as f:
            f.write(ts_output_content)
        print(f"Generated tag alias map proposal at {output_ts_file_path}")

        mapped_tags_count = len(final_map) + sum(len(v) for v in final_map.values())
        print(f"Processed {len(final_map)} primary tags with a total of {sum(len(v) for v in final_map.values())} aliases.")
        print(f"{len(unique_tags) - mapped_tags_count} tags remain unmapped (considered unique or not fitting rules).")

    except IOError:
        print(f"Error: Could not write to output file {output_ts_file_path}")


if __name__ == "__main__":
    # Assuming the script is in 'scripts/' directory and executed from workspace root
    # Input file is at the workspace root
    # Output file will be at the workspace root
    input_md = Path("all-unique-tags.md")
    output_ts = Path("tag_aliases_proposal.ts")

    generate_tag_aliases(input_md, output_ts)