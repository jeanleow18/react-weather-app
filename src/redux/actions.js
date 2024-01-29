export const setSearchHistory = (history) => ({
    type: 'SET_SEARCH_HISTORY',
    payload: history,
});

export const addSearchHistoryItem = (item) => ({
    type: 'ADD_SEARCH_HISTORY_ITEM',
    payload: item,
});

export const deleteSearchHistoryItem = (index) => ({
    type: 'DELETE_SEARCH_HISTORY_ITEM',
    payload: index,
});

export const setWeatherData = (data) => ({
    type: 'SET_WEATHER_DATA',
    payload: {
        data,
        timestamp: new Date().toLocaleString(),
    },
});

