from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
app = FastAPI()

class TranscriptInput(BaseModel):
    transcript: str

@app.post("/extract-tasks")
def extract_tasks(data: TranscriptInput):
    prompt = f"""
You are an assistant that extracts a clear list of action items or tasks from transcripts.
Transcript:
\"\"\"
{data.transcript}
\"\"\"
List the tasks as bullet points:
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return {"tasks": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# import openai
# import os

# # Load API key from environment variable
# client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# def extract_tasks_from_transcript(transcript):
#     prompt = f"""
# You are an assistant that extracts a clear list of action items or tasks from transcripts.
# Transcript:
# \"\"\"
# {transcript}
# \"\"\"
# List the tasks as bullet points:
# """

#     response = client.chat.completions.create(
#         model="gpt-4",
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.3
#     )

#     return response.choices[0].message.content

# if __name__ == "__main__":
#     filename = input("Enter the transcript filename (e.g., transcript.txt): ").strip()

#     try:
#         with open(filename, 'r', encoding='utf-8') as file:
#             transcript = file.read()
#     except FileNotFoundError:
#         print(f"❌ File '{filename}' not found.")
#         exit(1)

#     print("\n⏳ Processing...\n")
#     tasks = extract_tasks_from_transcript(transcript)
    
#     print("✅ **Extracted Tasks:**\n")
#     print(tasks)
