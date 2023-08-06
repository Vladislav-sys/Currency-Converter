"use strict";
class Select {
    constructor(id, conf) {
        var _a, _b;
        this.curItem = -1;
        this.mp = {USD: "us", EUR : "eu", GBP : "gb", AUD : "au", CAD : "ca", INR : "in", RUB : "ru", CNY :"cn" , TRY: "tr"};
        this.isOpen = false;
        const root = document.getElementById(id);
        const isTouch = window.ontouchstart !== undefined;
        if (isTouch)
            conf.isDrag = false;
        const contElem = this.createElem("div", { class: "select-container" });
        const textElem = this.createElem("div", { class: "select-text" });
        const spanElem = this.createElem("span", { class: "fi" });
        const iconElem = this.createElem("img", { class: "select-img", src: "select/icons/arrow.svg", alt: "arrow" });
        const listWrap = this.createElem("div", { class: "select-wrap" });
        const listElem = this.createElem("ul", { class: "select-list" });
        const elemHeight = Math.min(((_a = conf.maxShow) !== null && _a !== void 0 ? _a : 3), conf.items.length) * 60 + 2;
        listWrap.style.height = `${elemHeight}px`;
        if (conf.isDrag) {
            listWrap.style.overflowY = "hidden";
            contElem.classList.add("drag");
        }
        this.items = [];
        for (let itemText of conf.items) {
            let listItem;
            if (conf.isDrag) {
                const span = this.createElem("span", { class: "select-span" }, itemText);
                listItem = this.createElem("li", { class: "select-item" });
                listItem.append(span);
            }
            else {
                listItem = this.createElem("li", { class: "select-item" }, itemText);
            }
            this.items.push(listItem);
            listElem.append(listItem);
        }
        listWrap.append(listElem);
        contElem.append(spanElem, textElem, iconElem, listWrap);
        root.append(contElem);
        listElem.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!conf.isDrag) {
                const elem = e.target.closest(".select-item");
                if (!elem)
                    return;
                this.setItem(this.items.findIndex((item) => item === elem));
                return;
            }
            if (e.target.classList.contains("select-span")) {
                this.setItem(this.items.findIndex((item) => item.children[0] === e.target));
            }
        });
        let flag = true;
        if (conf.isDrag) {
            let curY;
            let curPx = 0;
            const fullHeight = conf.items.length * 60 + 2;
            listWrap.ondragstart = function () {
                return false;
            };
            listWrap.addEventListener("mousedown", (e) => {
                if (e.target.classList.contains("select-span"))
                    return;
                document.body.classList.add("grab");
                curY = e.clientY;
                flag = true;
                function handleMouseMove(e) {
                    const dir = e.clientY - curY;
                    if (dir < 0) {
                        curPx = Math.min(curPx - dir, fullHeight - elemHeight);
                    }
                    else {
                        curPx = Math.max(curPx - dir, 0);
                    }
                    listElem.style.transform = `translateY(${-curPx}px)`;
                    curY = e.clientY;
                }
                listWrap.addEventListener("mousemove", handleMouseMove);
                function handleMouseUp(e) {
                    if (e.target.closest(".select-container") && !e.target.closest(".select-wrap"))
                        flag = false;
                    if (e.target.classList.contains("select-wrap"))
                        flag = false;
                    listWrap.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                    document.body.classList.remove("grab");
                }
                document.addEventListener("mouseup", handleMouseUp);
            });
        }
        contElem.addEventListener("click", () => {
            if (!flag) {
                flag = true;
                return;
            }
            flag = true;
            if (this.isOpen) {
                this.close();
            }
            else {
                this.open();
            }
        });
        this.container = contElem;
        if ("placeholder" in conf) {
            textElem.textContent = conf.placeholder;
        }
        else {
            this.setItem((_b = conf.start) !== null && _b !== void 0 ? _b : 0);
        }
    }
    createElem(tagName, attrs, text) {
        const elem = document.createElement(tagName);
        if (text)
            elem.textContent = text;
        for (let key in attrs) {
            elem.setAttribute(key, attrs[key]);
        }
        return elem;
    }
    open() {
        this.isOpen = true;
        this.container.classList.add("open");
    }
    close() {
        this.isOpen = false;
        this.container.classList.remove("open");
    }
    destroy() {
        this.container.remove();
    }
    setItem(ind) {
        this.curItem = ind;
        this.items.forEach((item, num) => {
            if (num === ind) {
                item.classList.add("active");
                this.container.children[1].textContent = item.textContent;
                this.container.children[0].setAttribute("class" , `fi fi-${this.mp[item.textContent]}`)
            }
            else {
                item.classList.remove("active");
            }
        });
        this.close();
    }

}


