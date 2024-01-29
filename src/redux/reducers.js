const initialState = {
    searchHistory: [],
    weatherData: null,
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SEARCH_HISTORY':
            return { ...state, searchHistory: action.payload };

        case 'ADD_SEARCH_HISTORY_ITEM':
            return { ...state, searchHistory: [...state.searchHistory, action.payload] };

        case 'DELETE_SEARCH_HISTORY_ITEM':
            const newSearchHistory = [...state.searchHistory];
            newSearchHistory.splice(action.payload, 1);
            return { ...state, searchHistory: newSearchHistory };

        case 'SET_WEATHER_DATA':
            return { ...state, weatherData: action.payload.data, timestamp: action.payload.timestamp };

        default:
            return state;
    }
};

export default appReducer;
