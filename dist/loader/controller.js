"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const maius_1 = require("../maius");
const index_1 = require("../utils/index");
const base_1 = require("./base");
class ControllerLoader extends base_1.default {
    getIntancesCol() {
        const col = {};
        this.getFiles().forEach(item => {
            const UserClass = require(item.path);
            assert(index_1.isFunction(UserClass), `${item.name}.js is not a Class Function`);
            col[item.name] = new UserClass();
            assert(col[item.name] instanceof maius_1.default.Controller, `${item.name}.js is not the class extend from Controller class`);
        });
        return col;
    }
}
exports.default = ControllerLoader;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkZXIvY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUNqQyxvQ0FBNkI7QUFDN0IsMENBQTRDO0FBQzVDLGlDQUFnQztBQVFoQyxzQkFBc0MsU0FBUSxjQUFVO0lBRS9DLGNBQWM7UUFDbkIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXJDLE1BQU0sQ0FBQyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksNkJBQTZCLENBQUMsQ0FBQztZQUV6RSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7WUFFakMsTUFBTSxDQUNKLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksZUFBSyxDQUFDLFVBQVUsRUFDMUMsR0FBRyxJQUFJLENBQUMsSUFBSSxtREFBbUQsQ0FDaEUsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0NBRUY7QUFyQkQsbUNBcUJDIiwiZmlsZSI6ImxvYWRlci9jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgTWFpdXMgZnJvbSAnLi4vbWFpdXMnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWxzL2luZGV4JztcbmltcG9ydCBCYXNlTG9hZGVyIGZyb20gJy4vYmFzZSc7XG5cbi8qKlxuICogY29udHJvbGxlciBsb2FkZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sbGVyTG9hZGVyIGV4dGVuZHMgQmFzZUxvYWRlciB7XG5cbiAgcHVibGljIGdldEludGFuY2VzQ29sPFQ+KCk6IHsgW3g6IHN0cmluZ106IFQgfSB7XG4gICAgY29uc3QgY29sID0ge307XG5cbiAgICB0aGlzLmdldEZpbGVzKCkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IFVzZXJDbGFzcyA9IHJlcXVpcmUoaXRlbS5wYXRoKTtcblxuICAgICAgYXNzZXJ0KGlzRnVuY3Rpb24oVXNlckNsYXNzKSwgYCR7aXRlbS5uYW1lfS5qcyBpcyBub3QgYSBDbGFzcyBGdW5jdGlvbmApO1xuXG4gICAgICBjb2xbaXRlbS5uYW1lXSA9IG5ldyBVc2VyQ2xhc3MoKTtcblxuICAgICAgYXNzZXJ0KFxuICAgICAgICBjb2xbaXRlbS5uYW1lXSBpbnN0YW5jZW9mIE1haXVzLkNvbnRyb2xsZXIsXG4gICAgICAgIGAke2l0ZW0ubmFtZX0uanMgaXMgbm90IHRoZSBjbGFzcyBleHRlbmQgZnJvbSBDb250cm9sbGVyIGNsYXNzYCxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29sO1xuICB9XG5cbn1cbiJdfQ==
