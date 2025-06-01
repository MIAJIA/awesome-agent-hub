import json
import os
from pathlib import Path

def extract_tags_to_markdown():
    """
    Reads all JSON files from the '../ai-agent-hub-web/data/' directory,
    extracts all unique tags, and writes them to 'all-unique-tags.md'.
    """
    data_dir = Path(__file__).parent.parent / "ai-agent-hub-web" / "data"
    output_file = Path(__file__).parent.parent / "all-unique-tags.md"
    all_tags = set()

    if not data_dir.exists():
        print(f"Error: Data directory not found at {data_dir}")
        return

    for filename in os.listdir(data_dir):
        if filename.endswith(".json"):
            filepath = data_dir / filename
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, dict) and "tags" in data and isinstance(data["tags"], list):
                        for tag in data["tags"]:
                            if isinstance(tag, str):
                                all_tags.add(tag)
            except json.JSONDecodeError:
                print(f"Warning: Could not decode JSON from {filename}")
            except Exception as e:
                print(f"Warning: Error processing file {filename}: {e}")

    sorted_tags = sorted(list(all_tags))

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# All Unique Tags\n\n")
        if sorted_tags:
            for tag in sorted_tags:
                f.write(f"- {tag}\n")
        else:
            f.write("No tags found.\n")

    print(f"Successfully extracted {len(sorted_tags)} unique tags to {output_file}")

if __name__ == "__main__":
    extract_tags_to_markdown()