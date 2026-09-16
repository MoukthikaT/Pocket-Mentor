import mongoose from 'mongoose';

const useMongo = () => mongoose.connection.readyState === 1;

export { useMongo };
