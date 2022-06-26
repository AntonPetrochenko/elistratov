# elistratov
Личный бот для личных кеков. Расчитан на обслуживание одного канала, реализует простое key-value хранилище для пользователей

# Как использовать

Платформа ожидает commonjs модули в папке `games`, которые автоматически загружает при запуске.

Формат модулая: 

```js
let game = {
  describe() {
    //Динамически создаваемое описание, data-driven игры могут собирать здесь доступные себе данные и выводить их в команду "Андрей, расскажи о себе".
    //Вызывается один раз при запуске. TODO: Добавить перезапуск этой функции при каждом вызове "о себе"?
    return { 
      name: `Название игры`,
      description: `Описание игры` 
    }
  },
  setup(telegram) {
    //Ваш код инициализации игры. Здесь привязываются события Telegram.
    //аргумент telegram - экземпляр node-telegram-bot-api
  }
}


module.exports = game

```


Работа с хранилищем

```js
//Данные пользователей
const userTracker = require('../util/userTracker')
let userData = userTracker.referenceUser(telegramSender)
userTracker.kvUser(user, key, value)

//Данные игр
const storage = require('../util/genericStorage').make('storage-name')
storage.write({key1: value1, key2: value2})
let currentStorageContents = storage.get()

```

TODO:
- Хранилища реализованы ОЧЕНЬ КРИВО. Для начала, данные пользователей и данные свободного использования реализованы по разному.
- Хранилища не используют СУБД, пишут в json файл. Заменить на sqlite.
- И много чего кривого. Этот код не рекомендуется использовать как есть.
