// ============================================
// Конфигурация и константы
// ============================================
const CONFIG = {
    UPDATE_INTERVAL: 1000,
    PRAYER_NAMES: ['fajr', 'sunrise', 'zuhr', 'asr', 'magrib', 'isha']
};

// ============================================
// Данные городов (централизованное хранение)
// ============================================
const CITIES_DATA = {
    'Кемерово': {
        Jan: {
            "01.01": ["08:07", "09:37", "13:30", "15:19", "17:02", "18:32"],
            "02.01": ["08:07", "09:37", "13:30", "15:20", "17:03", "18:33"],
            "03.01": ["08:07", "09:37", "13:30", "15:21", "17:04", "18:34"],
            "04.01": ["08:06", "09:36", "13:30", "15:22", "17:05", "18:35"],
            "05.01": ["08:06", "09:36", "13:30", "15:22", "17:06", "18:36"],
            "06.01": ["08:05", "09:35", "13:30", "15:23", "17:07", "18:37"],
            "07.01": ["08:05", "09:35", "13:30", "15:23", "17:09", "18:39"],
            "08.01": ["08:04", "09:34", "13:30", "15:24", "17:10", "18:40"],
            "09.01": ["08:04", "09:34", "13:30", "15:25", "17:11", "18:41"],
            "10.01": ["08:03", "09:33", "13:30", "15:27", "17:12", "18:42"],
            "11.01": ["08:02", "09:32", "13:30", "15:30", "17:14", "18:44"],
            "12.01": ["08:02", "09:32", "13:30", "15:32", "17:16", "18:46"],
            "13.01": ["08:01", "09:31", "13:30", "15:34", "17:18", "18:48"],
            "14.01": ["08:01", "09:31", "13:30", "15:36", "17:20", "18:50"],
            "15.01": ["08:00", "09:30", "13:30", "15:38", "17:22", "18:52"],
            "16.01": ["07:59", "09:29", "13:30", "15:40", "17:24", "18:54"],
            "17.01": ["07:58", "09:28", "13:30", "15:42", "17:26", "18:56"],
            "18.01": ["07:56", "09:26", "13:30", "15:44", "17:28", "18:58"],
            "19.01": ["07:55", "09:25", "13:30", "15:46", "17:30", "19:00"],
            "20.01": ["07:54", "09:24", "13:30", "15:48", "17:32", "19:02"],
            "21.01": ["07:53", "09:23", "13:30", "15:50", "17:34", "19:04"],
            "22.01": ["07:51", "09:21", "13:30", "15:52", "17:36", "19:06"],
            "23.01": ["07:49", "09:19", "13:30", "15:53", "17:38", "19:08"],
            "24.01": ["07:48", "09:18", "13:30", "15:55", "17:40", "19:10"],
            "25.01": ["07:46", "09:16", "13:30", "15:57", "17:42", "19:12"],
            "26.01": ["07:45", "09:15", "13:30", "15:59", "17:44", "19:14"],
            "27.01": ["07:43", "09:13", "13:30", "16:01", "17:46", "19:16"],
            "28.01": ["07:42", "09:12", "13:30", "16:03", "17:48", "19:18"],
            "29.01": ["07:40", "09:10", "13:30", "16:05", "17:50", "19:20"],
            "30.01": ["07:39", "09:09", "13:30", "16:07", "17:52", "19:22"],
            "31.01": ["07:37", "09:07", "13:30", "16:09", "17:54", "19:24"]
        },
        "Nov": {
            "01.11": ["06:46", "08:16", "13:30", "16:00", "17:46", "19:16"],
            "02.11": ["06:48", "08:18", "13:30", "15:58", "17:44", "19:14"],
            "03.11": ["06:50", "08:20", "13:30", "15:56", "17:42", "19:12"],
            "04.11": ["06:52", "08:22", "13:30", "15:54", "17:40", "19:10"],
            "05.11": ["06:54", "08:24", "13:30", "15:52", "17:38", "19:08"],
            "06.11": ["06:56", "08:26", "13:30", "15:50", "17:37", "19:07"],
            "07.11": ["06:58", "08:28", "13:30", "15:48", "17:35", "19:05"],
            "08.11": ["07:01", "08:31", "13:30", "15:46", "17:33", "19:03"],
            "09.11": ["07:03", "08:33", "13:30", "15:44", "17:31", "19:01"],
            "10.11": ["07:05", "08:35", "13:30", "15:43", "17:29", "18:59"],
            "11.11": ["07:07", "08:37", "13:30", "15:42", "17:27", "18:57"],
            "12.11": ["07:09", "08:39", "13:30", "15:41", "17:25", "18:55"],
            "13.11": ["07:11", "08:41", "13:30", "15:40", "17:24", "18:54"],
            "14.11": ["07:13", "08:43", "13:30", "15:39", "17:22", "18:52"],
            "15.11": ["07:15", "08:45", "13:30", "15:38", "17:20", "18:50"],
            "16.11": ["07:17", "08:47", "13:30", "15:37", "17:19", "18:49"],
            "17.11": ["07:19", "08:49", "13:30", "15:36", "17:17", "18:47"],
            "18.11": ["07:22", "08:52", "13:30", "15:35", "17:16", "18:46"],
            "19.11": ["07:23", "08:53", "13:30", "15:34", "17:14", "18:44"],
            "20.11": ["07:25", "08:55", "13:30", "15:33", "17:13", "18:43"],
            "21.11": ["07:27", "08:57", "13:30", "15:32", "17:11", "18:41"],
            "22.11": ["07:29", "08:59", "13:30", "15:31", "17:10", "18:40"],
            "23.11": ["07:31", "09:01", "13:30", "15:30", "17:09", "18:39"],
            "24.11": ["07:33", "09:03", "13:30", "15:29", "17:08", "18:38"],
            "25.11": ["07:35", "09:05", "13:30", "15:28", "17:06", "18:36"],
            "26.11": ["07:37", "09:07", "13:30", "15:27", "17:05", "18:35"],
            "27.11": ["07:39", "09:09", "13:30", "15:27", "17:04", "18:34"],
            "28.11": ["07:41", "09:10", "13:30", "15:26", "17:03", "18:33"],
            "29.11": ["07:42", "09:11", "13:30", "15:26", "17:02", "18:32"],
            "30.11": ["07:43", "09:12", "13:30", "15:25", "17:00", "18:30"]
        },
        // Добавьте остальные месяцы по аналогии...
        // Для краткости показан только январь
    },
    'Новокузнецк': {
        // Аналогично Кемерово
    },
    'Прокопьевск': {
        // Аналогично Кемерово
    },
    'Ленинск-Кузнецкий': {
        // Аналогично Кемерово
    },
    'Юрга': {
        // Аналогично Кемерово
    }
};

// ============================================
// Класс для работы с временем намазов
// ============================================
class PrayerTimesManager {
    constructor(cityName) {
        this.cityName = cityName;
        this.currentDate = moment();
        this.prayerTimes = [];
        this.updatePrayerTimes();
    }

    setCityName(cityName) {
        this.cityName = cityName;
        this.updatePrayerTimes();
    }

    updatePrayerTimes() {
        const month = this.currentDate.format('MMM');
        const date = this.currentDate.format('DD.MM');

        const cityData = CITIES_DATA[this.cityName];
        if (!cityData || !cityData[month] || !cityData[month][date]) {
            console.error('Данные для города или даты не найдены');
            return;
        }

        const times = cityData[month][date];
        this.prayerTimes = times.map((time, index) => ({
            name: CONFIG.PRAYER_NAMES[index],
            time: moment(time, 'HH:mm'),
            displayTime: time
        }));
    }

    getPrayerTimes() {
        return this.prayerTimes;
    }

    getNextPrayer() {
        const now = moment();

        for (let prayer of this.prayerTimes) {
            if (prayer.time.isAfter(now)) {
                return prayer;
            }
        }

        // Если все намазы прошли, возвращаем первый намаз следующего дня
        const tomorrow = moment().add(1, 'day');
        const nextFajr = moment(this.prayerTimes[0].time);
        nextFajr.set({
            year: tomorrow.year(),
            month: tomorrow.month(),
            date: tomorrow.date()
        });

        return {
            name: this.prayerTimes[0].name,
            time: nextFajr,
            displayTime: this.prayerTimes[0].displayTime
        };
    }

    getTimeUntilNextPrayer() {
        const nextPrayer = this.getNextPrayer();
        const now = moment();
        const duration = moment.duration(nextPrayer.time.diff(now));

        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        return {
            hours,
            minutes,
            seconds,
            formatted: `${hours} ч ${minutes} мин`
        };
    }
}

// ============================================
// Класс для работы с UI
// ============================================
class UIManager {
    constructor() {
        this.elements = {
            time: document.getElementById('currtime'),
            date: document.getElementById('currdate'),
            cityName: document.getElementById('selectedCity'),
            citySelect: document.getElementById('city'),
            countdown: document.getElementById('countdown'),
            prayers: {
                fajr: document.getElementById('fajr'),
                sunrise: document.getElementById('vosxod'),
                zuhr: document.getElementById('zuhr'),
                asr: document.getElementById('asr'),
                magrib: document.getElementById('magrib'),
                isha: document.getElementById('isha')
            }
        };
    }

    updateDateTime() {
        const now = moment();
        this.elements.time.textContent = now.format('HH:mm:ss');
        this.elements.date.textContent = now.format('DD.MM.YYYY');
    }

    updatePrayerTimes(prayerTimes) {
        prayerTimes.forEach(prayer => {
            const element = this.elements.prayers[prayer.name];
            if (element) {
                element.textContent = prayer.displayTime;
            }
        });
    }

    updateCountdown(timeData) {
        this.elements.countdown.textContent = timeData.formatted;
    }

    updateCityName(cityName) {
        this.elements.cityName.textContent = cityName;
    }

    getCitySelect() {
        return this.elements.citySelect;
    }
}

// ============================================
// Класс для проверки интернет-соединения
// ============================================
class ConnectionManager {
    constructor() {
        this.isRedirecting = false;
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('offline', () => this.handleOffline());
        // Проверка при загрузке
        this.checkConnection();
    }

    checkConnection() {
        if (!window.navigator.onLine && !this.isRedirecting) {
            this.handleOffline();
        }
    }

    handleOffline() {
        if (!this.isRedirecting) {
            this.isRedirecting = true;
            console.log('Интернет-соединение потеряно.');
            window.location.href = 'no-internet.html';
        }
    }
}

// ============================================
// Главный класс приложения
// ============================================
class PrayerTimesApp {
    constructor() {
        this.ui = new UIManager();
        this.connectionManager = new ConnectionManager();

        const defaultCity = 'Кемерово';
        this.prayerManager = new PrayerTimesManager(defaultCity);

        this.init();
    }

    init() {
        // Установка начального города
        this.ui.updateCityName(this.prayerManager.cityName);

        // Обновление времен намазов
        this.updateDisplay();

        // Настройка обработчиков событий
        this.setupEventListeners();

        // Запуск обновления времени
        this.startUpdateLoop();

        // Проверка смены даты для обновления мотивационного текста
        this.checkDateChange();
    }

    setupEventListeners() {
        const citySelect = this.ui.getCitySelect();
        citySelect.addEventListener('change', (e) => {
            const selectedCity = e.target.value;
            this.prayerManager.setCityName(selectedCity);
            this.ui.updateCityName(selectedCity);
            this.updateDisplay();
        });
    }

    updateDisplay() {
        // Обновление дата и время
        this.ui.updateDateTime();

        // Обновление времен намазов
        const prayerTimes = this.prayerManager.getPrayerTimes();
        this.ui.updatePrayerTimes(prayerTimes);

        // Обновление обратного отсчета
        const timeUntilNext = this.prayerManager.getTimeUntilNextPrayer();
        this.ui.updateCountdown(timeUntilNext);

        // Проверка смены даты
        this.checkDateChange();
    }

    startUpdateLoop() {
        setInterval(() => {
            this.updateDisplay();
        }, CONFIG.UPDATE_INTERVAL);
    }

    checkDateChange() {
        const now = moment();
        if (now.hours() === 0 && now.minutes() === 0 && now.seconds() === 0) {
            this.prayerManager.updatePrayerTimes();
            this.updateDisplay();
            this.showMotivationalText();
        }
    }

    showMotivationalText() {
        const randomIndex = Math.floor(Math.random() * CONFIG.MOTIVATIONAL_TEXTS.length);
        const text = CONFIG.MOTIVATIONAL_TEXTS[randomIndex];

        // Можно добавить отображение текста в UI, если требуется
        console.log(text);
    }
}

// ============================================
// Инициализация приложения
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new PrayerTimesApp();
});