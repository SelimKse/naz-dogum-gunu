// MongoDB bağlantı yardımcısı
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

if (process.env.NODE_ENV === "development") {
  // Development modunda global değişken kullan
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production'da her seferinde yeni bağlantı
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
