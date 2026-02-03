import chromadb


client = chromadb.HttpClient(
    host="localhost", 
    port=8888
)

collection = client.get_or_create_collection(name="hr_knowledge")