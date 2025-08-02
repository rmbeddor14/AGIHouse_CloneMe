# AGIHouse_CloneMe
Clone me so I don't need to make this phone call! 


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