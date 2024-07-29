import 'dotenv/config';
import app from './app/app';

const PORT = process.env.SERVER_PORT || 8008;

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`server has started on PORT: ${PORT}`);
    });
};

startServer();
