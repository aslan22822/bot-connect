require('dotenv').config();
const express = require('express');
const { setupBot } = require('./bot/bot');
const { setupWebServer } = require('./web/server');

const app = express(); // Создание объекта Express
const port = process.env.PORT || 3000;

// Передаём объект app в setupBot
setupBot(app);

// Настройка веб-сервера
setupWebServer(app);

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
