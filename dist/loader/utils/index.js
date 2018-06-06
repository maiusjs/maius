"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.getFiles = (dirPath, dirname) => {
    let list;
    try {
        list = fs.readdirSync(dirPath);
    }
    catch (error) {
        throw new Error(`Cannot find ${dirname} directory in rootDir`);
    }
    const files = list
        .filter(item => /.*?\.js$/.test(item))
        .map(item => ({
        name: /(.*?)\.js$/.exec(item)[1],
        path: path.join(dirPath, item),
    }));
    return files;
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkZXIvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBTWhCLFFBQUEsUUFBUSxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQzNDLElBQUksSUFBSSxDQUFDO0lBQ1QsSUFBSTtRQUNGLElBQUksR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2hDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsT0FBTyx1QkFBdUIsQ0FBQyxDQUFDO0tBQ2hFO0lBR0QsTUFBTSxLQUFLLEdBQUcsSUFBSTtTQUVmLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FLckMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNaLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO0tBQy9CLENBQUMsQ0FBQyxDQUFDO0lBRU4sT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUMiLCJmaWxlIjoibG9hZGVyL3V0aWxzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuLyoqXG4gKiBAcHJvcCB7U3RyaW5nfSBwYXRoIOaWh+S7tui3r+W+hFxuICogQHByb3Age1N0cmluZ30gZGlybmFtZSDmlofku7blpLnlkI1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEZpbGVzID0gKGRpclBhdGgsIGRpcm5hbWUpID0+IHtcbiAgbGV0IGxpc3Q7XG4gIHRyeSB7XG4gICAgbGlzdCA9IGZzLnJlYWRkaXJTeW5jKGRpclBhdGgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgJHtkaXJuYW1lfSBkaXJlY3RvcnkgaW4gcm9vdERpcmApO1xuICB9XG5cbiAgLy8gZmlsdGVyICouanNcbiAgY29uc3QgZmlsZXMgPSBsaXN0XG4gICAgLy8g6L+H5ruk5o6J5omA5pyJ6Z2eIC5qcyDnu5PlsL7nmoTmlofku7ZcbiAgICAuZmlsdGVyKGl0ZW0gPT4gLy4qP1xcLmpzJC8udGVzdChpdGVtKSlcbiAgICAvKipcbiAgICAgKiBAcHJvcCB7U3RyaW5nfSBwYXRoIOaWh+S7tui3r+W+hFxuICAgICAqIEBwcm9wIHtTdHJpbmd9IG5hbWUg5paH5Lu25ZCN56ew77yM5LiN5YyF5ZCr5paH5Lu25ouT5bGV5ZCNXG4gICAgICovXG4gICAgLm1hcChpdGVtID0+ICh7XG4gICAgICBuYW1lOiAvKC4qPylcXC5qcyQvLmV4ZWMoaXRlbSlbMV0sXG4gICAgICBwYXRoOiBwYXRoLmpvaW4oZGlyUGF0aCwgaXRlbSksXG4gICAgfSkpO1xuXG4gIHJldHVybiBmaWxlcztcbn07XG4iXX0=
