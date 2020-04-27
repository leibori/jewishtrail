const positionReducer = (state = { lat: 0, lng: 0, country: '' }, action) => {
    switch(action.type) {
        case 'FIND_POSITION':
            return {
                lat: action.lat,
                lng: action.lng,
                country: action.country
            }
        default:
            return state
    }
};

export default positionReducer;