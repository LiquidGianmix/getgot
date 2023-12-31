import random

def generate_random_integer():
    return str(random.randint(100000, 999999))

def main():
    # Read the content of full.txt
    with open('full.txt', 'r') as full_file:
        lines = full_file.readlines()

    random.shuffle(lines)

    # Create 30 files with random 6-digit integer titles
    for i in range(30):
        # Generate a random 6-digit integer for the file title
        file_title = generate_random_integer()

        # Take 5 unique lines for the current file
        file_content = lines[i*5 : (i+1)*5]

        # Remove the selected lines from the pool to avoid repetition
        lines = [line for line in lines if line not in file_content]

        # Write the lines to the file
        with open(f'{file_title}.txt', 'w') as file:
            print(f"writing {file_title}.txt") 
            file.writelines(file_content)

    # Put the remaining lines in replacements.txt
    remaining_lines = lines
    with open('replacements.txt', 'w') as replacements_file:
        print(f"writing replacement") 
        replacements_file.writelines(remaining_lines)

if __name__ == "__main__":
    main()

