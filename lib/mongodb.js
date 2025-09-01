import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://2230307367:chen5678@cluster0.gxgyome.mongodb.net/nextjs-packages';

if (!MONGODB_URI) {
  throw new Error('请定义MONGODB_URI环境变量');
}

/**
 * 全局缓存变量，避免多次连接
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB连接成功');
      console.log('📊 数据库名称:', mongoose.connection.db.databaseName);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB连接失败:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB; 