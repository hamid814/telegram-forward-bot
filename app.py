from telethon.sync import TelegramClient
from telethon import functions, types

name = ''
api_id = 0
api_hash = ''

def writeToFile(txt):
  f = open("res.txt", "w")
  f.write(txt)
  f.close()

def app():
  with TelegramClient(name, api_id, api_hash) as client:
      result = client(functions.channels.GetMessagesRequest(
          channel='BeingLogical',
          id=[1990]
      ))
      writeToFile(result.stringify())


app()
