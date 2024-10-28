/**
 * 封装操作localstorage本地存储的方法
 */
export const storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
		localStorage.clear();
	}
};