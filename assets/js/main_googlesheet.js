// ============================================
// Конфигурация Google Sheets API
// ============================================
const GOOGLE_SHEETS_CONFIG = {
    SHEET_ID: '1c-iLepQ6x4nPkf32uVGxY4dUX-qOQyHM0XTM8K014kE', // Замените на ID вашей таблицы
    API_KEY: 'AIzaSyCKnVBMYLkQm1c7jIzrwyN3xww_M4P9-Y8',      // Замените на ваш API ключ
    CITY_SHEETS: {
        'Кемерово': 'Кемерово',
        'Новокузнецк': 'Новокузнецк',
        'Прокопьевск': 'Прокопьевск',
        'Ленинск-Кузнецкий': 'Ленинск-Кузнецкий',
        'Юрга': 'Юрга'
    }
};

// ============================================
// Конфигурация приложения
// ============================================
const CONFIG = {
    UPDATE_INTERVAL: 1000,
    CACHE_DURATION: 3600000, // 1 час в миллисекундах
    PRAYER_NAMES: ['fajr', 'sunrise', 'zuhr', 'asr', 'magrib', 'isha'],
    PRAYER_DISPLAY_NAMES: {
        fajr: 'Фаджр',
        sunrise: 'Восход',
        zuhr: 'Зухр',
        asr: 'Аср',
        magrib: 'Магриб',
        isha: 'Иша'
    }
};

// ============================================
// Класс для работы с Google Sheets
// ============================================
class GoogleSheetsService {
    constructor(sheetId, apiKey) {
        this.sheetId = sheetId;
        this.apiKey = apiKey;
        this.cache = new Map();
    }

    /**
     * Загрузка данных из Google Sheets
     */
    async loadCityData(cityName) {
        // Проверка кэша
        const cacheKey = `${cityName}_${new Date().toDateString()}`;
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
                console.log('📦 Загружено из кэша:', cityName);
                return cached.data;
            }
        }

        const sheetName = GOOGLE_SHEETS_CONFIG.CITY_SHEETS[cityName];
        if (!sheetName) {
            throw new Error(`Город "${cityName}" не найден в конфигурации`);
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${encodeURIComponent(sheetName)}?key=${this.apiKey}`;

        try {
            console.log('🌐 Загрузка данных из Google Sheets:', cityName);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            const parsedData = this.parseSheetData(result.values);

            // Сохранение в кэш
            this.cache.set(cacheKey, {
                data: parsedData,
                timestamp: Date.now()
            });

            return parsedData;
        } catch (error) {
            console.error('❌ Ошибка при загрузке данных:', error);
            throw error;
        }
    }

    /**
     * Парсинг данных из таблицы
     */
    parseSheetData(rows) {
        if (!rows || rows.length < 2) {
            throw new Error('Таблица пуста или имеет неверный формат');
        }

        const data = {};

        // Пропускаем заголовок (первая строка)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];

            // Проверка на пустую строку
            if (!row || row.length < 8) continue;

            const [date, month, fajr, sunrise, zuhr, asr, magrib, isha] = row;

            // Инициализация месяца если нужно
            if (!data[month]) {
                data[month] = {};
            }

            // Сохранение времен намазов
            data[month][date] = [fajr, sunrise, zuhr, asr, magrib, isha];
        }

        return data;
    }

    /**
     * Очистка кэша
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Кэш очищен');
    }
}

// ============================================
// Класс для работы с временем намазов
// ============================================
class PrayerTimesManager {
    constructor(sheetsService, cityName) {
        this.sheetsService = sheetsService;
        this.cityName = cityName;
        this.currentDate = moment();
        this.prayerTimes = [];
        this.cityData = null;
        this.isLoading = false;
    }

    async initialize() {
        await this.loadCityData();
        this.updatePrayerTimes();
    }

    async loadCityData() {
        if (this.isLoading) return;

        this.isLoading = true;
        try {
            this.cityData = await this.sheetsService.loadCityData(this.cityName);
            console.log('✅ Данные загружены для города:', this.cityName);
        } catch (error) {
            console.error('❌ Ошибка загрузки данных города:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async setCityName(cityName) {
        this.cityName = cityName;
        await this.loadCityData();
        this.updatePrayerTimes();
    }

    updatePrayerTimes() {
        if (!this.cityData) {
            console.warn('⚠️ Данные города еще не загружены');
            return;
        }

        const month = this.currentDate.format('MMM');
        const date = this.currentDate.format('DD.MM');

        if (!this.cityData[month] || !this.cityData[month][date]) {
            console.error('❌ Данные для даты не найдены:', date, month);
            return;
        }

        const times = this.cityData[month][date];
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

        return {
            hours,
            minutes,
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

    showLoading() {
        this.elements.countdown.textContent = 'Загрузка...';
    }

    showError(message) {
        console.error('UI Error:', message);
        this.elements.countdown.textContent = 'Ошибка загрузки';
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
            console.log('⚠️ Интернет-соединение потеряно');
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
        this.sheetsService = new GoogleSheetsService(
            GOOGLE_SHEETS_CONFIG.SHEET_ID,
            GOOGLE_SHEETS_CONFIG.API_KEY
        );

        const defaultCity = 'Кемерово';
        this.prayerManager = new PrayerTimesManager(this.sheetsService, defaultCity);

        this.init();
    }

    async init() {
        try {
            this.ui.showLoading();

            // Загрузка данных
            await this.prayerManager.initialize();

            // Установка начального города
            this.ui.updateCityName(this.prayerManager.cityName);

            // Обновление времен намазов
            this.updateDisplay();

            // Настройка обработчиков событий
            this.setupEventListeners();

            // Запуск обновления времени
            this.startUpdateLoop();

            console.log('✅ Приложение успешно инициализировано');
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            this.ui.showError('Не удалось загрузить данные');

            // Повторная попытка через 5 секунд
            setTimeout(() => this.init(), 5000);
        }
    }

    setupEventListeners() {
        const citySelect = this.ui.getCitySelect();
        citySelect.addEventListener('change', async (e) => {
            const selectedCity = e.target.value;

            try {
                this.ui.showLoading();
                await this.prayerManager.setCityName(selectedCity);
                this.ui.updateCityName(selectedCity);
                this.updateDisplay();
            } catch (error) {
                console.error('❌ Ошибка смены города:', error);
                this.ui.showError('Не удалось загрузить данные города');
            }
        });
    }

    updateDisplay() {
        try {
            // Обновление дата и время
            this.ui.updateDateTime();

            // Обновление времен намазов
            const prayerTimes = this.prayerManager.getPrayerTimes();
            if (prayerTimes.length > 0) {
                this.ui.updatePrayerTimes(prayerTimes);
            }

            // Обновление обратного отсчета
            const timeUntilNext = this.prayerManager.getTimeUntilNextPrayer();
            this.ui.updateCountdown(timeUntilNext);

            // Проверка смены даты
            this.checkDateChange();
        } catch (error) {
            console.error('❌ Ошибка обновления дисплея:', error);
        }
    }

    startUpdateLoop() {
        setInterval(() => {
            this.updateDisplay();
        }, CONFIG.UPDATE_INTERVAL);
    }

    async checkDateChange() {
        const now = moment();
        if (now.hours() === 0 && now.minutes() === 0 && now.seconds() === 0) {
            console.log('📅 Смена даты, обновление данных...');
            await this.prayerManager.initialize();
            this.updateDisplay();
        }
    }
}

// ============================================
// Инициализация приложения
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Проверка конфигурации
    if (GOOGLE_SHEETS_CONFIG.SHEET_ID === '1c-iLepQ6x4nPkf32uVGxY4dUX-qOQyHM0XTM8K014kE' ||
        GOOGLE_SHEETS_CONFIG.API_KEY === 'AIzaSyCKnVBMYLkQm1c7jIzrwyN3xww_M4P9-Y8') {
        console.error('❌ ОШИБКА: Необходимо настроить GOOGLE_SHEETS_CONFIG!');
        alert('Ошибка конфигурации: Пожалуйста, настройте ID таблицы и API ключ в файле main.js');
        return;
    }

    // Запуск приложения
    new PrayerTimesApp();

    console.log('🚀 Приложение запущено с Google Sheets интеграцией');
});