export const addFavotiteToLocalStorage = (data, userId) => {
    if (!userId) return; // Require userId for authentication
    const favorites = getLocalStorageFavorites(userId);
    if(!favorites.find((item)=> item._id === data._id)){
        favorites.push(data);
        localStorage.setItem(`favorites_${userId}` , JSON.stringify(favorites));
    }

}
export const removeFavoriteFromLocalStorage = (data, userId) => {
    if (!userId) return; // Require userId for authentication
    const favorites = getLocalStorageFavorites(userId);
    const updatedFavorites = favorites.filter((item) => item._id !== data._id);
    localStorage.setItem(`favorites_${userId}` , JSON.stringify(updatedFavorites));
}


export const getLocalStorageFavorites = (userId) => {
    if (!userId) return []; // Return empty array if no userId
    const favorites = localStorage.getItem(`favorites_${userId}`);
    if(favorites){
        return JSON.parse(favorites);
    }
    return [];
}