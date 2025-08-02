# AGIHouse_CloneMe
Clone me so I don't need to make this phone call! 

## Architecture
https://docs.google.com/drawings/d/1Ky5M7jLHlnTaymkUq50rNUKajuXyqPTLvEGs45hiuuo/edits

## Transcript -> Tasks (generate_tasks_api)

- This is used for the stage where you take the transcript and put it into tasks

How to Run the API (open on amazon temporarily)

if your transcript is in a JSON

```
curl -X POST http://54.91.226.222:8000/extract-tasks \
  -H "Content-Type: application/json" \
  -d '{"transcript": "We agreed that Sarah will send the proposal by Friday and Tom will handle the budget review."}'
```

or if you have it in a txt file e.g. `transcript.txt`

```
jq -Rs '{transcript: .}' transcript.txt | curl -X POST http://54.91.226.222:8000/extract-tasks \
  -H "Content-Type: application/json" \
  -d @-
``` 

### How to run this one in the backend
- inside the AWS VM run 

```
nohup uvicorn generate_tasks:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
```
but that keeps it in the foreground so put it in the background with
`ps aux | grep uvicorn` check to see the PID
`kill <PID>`


 ## Vibe Coded InWorld

 - BTW I gitignored the files from the getting started but you can recreate this by downloading the getting started package 
 - runtime quickstart https://docs.inworld.ai/docs/node/quickstart

 - audi from inworld taught me how to vibe code inworld graph with cursor - worked great! 
 - first is a test 

 - check out the video vibecodesuccess in the img folder and see how well it worked!! 

 - also had it do a html frontend and that was super cool too, but i think it might add too much complexity when trying to connect everything 