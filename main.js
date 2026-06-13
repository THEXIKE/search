// ========== DOM变量声明 ==========
const showModalBtn = document.querySelector(".show-modal");
const bottomSheet = document.querySelector(".buttom-sheet");
const sheetOverlay = bottomSheet.querySelector(".sheet-overlay");
const sheetContent = bottomSheet.querySelector(".content");
const dragIcon = bottomSheet.querySelector(".drag-icon");
const searchInput = document.getElementById('searchInput');
const searchContainer = document.querySelector('.search-container');
const keepInputToggle = document.getElementById('keepInputToggle');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const startTimeDisplay = document.getElementById('startTimeDisplay');
const endTimeDisplay = document.getElementById('endTimeDisplay');
const timePicker = document.getElementById('timePicker');
const searchBtn = document.getElementById('searchBtn');

// ========== 第四项：启用搜索按钮 ==========
const enableSearchBtnToggle = document.getElementById('enableSearchBtnToggle');

// ========== 第五项：启用搜索建议 ==========
const enableSuggestionToggle = document.getElementById('enableSuggestionToggle');
const suggestionList = document.getElementById('suggestionList');
let suggestionTimer = null;
let hideSuggestionTimer = null;

// ========== 搜索引擎选项 ==========
const engineOptions = document.getElementById('engineOptions');
const engineItems = engineOptions ? engineOptions.querySelectorAll('.option-item') : [];

// ========== 深色模式选项 ==========
const darkModeOptions = document.getElementById('darkModeOptions');
const darkModeItems = darkModeOptions ? darkModeOptions.querySelectorAll('.option-item') : [];

// ========== 全局初始值 ==========
const viewport = window.visualViewport;
const initViewportHeight = viewport.height;
const heightTolerance = 80;

// ========== 搜索按钮延迟定时器 ==========
let searchBtnTimer = null;

// ========== 搜索引擎配置 ==========
const searchEngines = {
    bing: 'https://www.bing.com/search?q=',
    google: 'https://www.google.com/search?q=',
    baidu: 'https://www.baidu.com/s?wd='
};

// ========== 快速便签（变量） ==========
const enableShortcutToggle = document.getElementById('enableShortcutToggle');
const shortcutArea = document.getElementById('shortcutArea');
const shortcutGrid = document.getElementById('shortcutGrid');
const shortcutSheet = document.getElementById('shortcutSheet');
const shortcutClose = document.getElementById('shortcutClose');
const shortcutSheetOverlay = shortcutSheet.querySelector('.sheet-overlay');
let shortcuts = [];
let currentShortcutIcon = 'assets/image-outline.svg';
let currentOverlay = null;

// 弹窗内元素
const shortcutIconBtn = document.getElementById('shortcutIconBtn');
const shortcutIconFile = document.getElementById('shortcutIconFile');
const shortcutIconPreview = document.getElementById('shortcutIconPreview');
const shortcutNameInput = document.getElementById('shortcutNameInput');
const shortcutUrlInput = document.getElementById('shortcutUrlInput');
const shortcutAddConfirm = document.getElementById('shortcutAddConfirm');

// ========== 编辑弹窗相关变量 ==========
const editSheet = document.getElementById('editSheet');
const editClose = document.getElementById('editClose');          // 现在作为删除按钮使用
const editSheetOverlay = editSheet.querySelector('.sheet-overlay');
const editIconBtn = document.getElementById('editIconBtn');
const editIconFile = document.getElementById('editIconFile');
const editIconPreview = document.getElementById('editIconPreview');
const editNameInput = document.getElementById('editNameInput');
const editUrlInput = document.getElementById('editUrlInput');
const editSaveConfirm = document.getElementById('editSaveConfirm');
let editingIndex = -1;

// ========== 子开关及连体动画容器 ==========
const shortcutExtraWrapper = document.getElementById('shortcutExtraWrapper');
const iconFillToggle = document.getElementById('iconFillToggle');
const showShortcutTextToggle = document.getElementById('showShortcutTextToggle');
const shiftDownToggle = document.getElementById('shiftDownToggle');
const hideAddBtnToggle = document.getElementById('hideAddBtnToggle');

// ========== 停用位移效果 ==========
const disableMoveEffectToggle = document.getElementById('disableMoveEffectToggle');

// ========== 自定义搜索引擎弹窗 ==========
const customSearchSheet = document.getElementById('customSearchSheet');
const customSearchClose = document.getElementById('customSearchClose');
const customNameInput = document.getElementById('customNameInput');
const customUrlInput = document.getElementById('customUrlInput');
const customSearchConfirm = document.getElementById('customSearchConfirm');

// ========== 壁纸功能 ==========
const wallpaperRow = document.getElementById('wallpaperRow');
const wallpaperArrow = document.getElementById('wallpaperArrow');
const wallpaperDivider = document.getElementById('wallpaperDivider');
const wallpaperDelete = document.getElementById('wallpaperDelete');
const wallpaperFileInput = document.createElement('input');
wallpaperFileInput.type = 'file';
wallpaperFileInput.accept = 'image/*';
wallpaperFileInput.style.display = 'none';
document.body.appendChild(wallpaperFileInput);

// ========== 其他：自定搜索引擎开关 ==========
const enableCustomEngineToggle = document.getElementById('enableCustomEngineToggle');

// ========== 隐藏设置按钮开关 ==========
const hideSettingsBtnToggle = document.getElementById('hideSettingsBtnToggle');

// ========== 删除确认弹窗变量 ==========
const clearConfirmSheet = document.getElementById('clearConfirmSheet');
const clearConfirmOverlay = document.getElementById('clearConfirmOverlay');
const clearConfirmBtn = document.getElementById('clearConfirmBtn');

// ========== 时间显示同步 ==========
function updateTimeDisplays() {
    if(startTimeDisplay) startTimeDisplay.textContent = startTimeInput.value;
    if(endTimeDisplay) endTimeDisplay.textContent = endTimeInput.value;
}
startTimeInput.addEventListener('change', () => {
    updateTimeDisplays();
    saveTimeToLocal();
});
endTimeInput.addEventListener('change', () => {
    updateTimeDisplays();
    saveTimeToLocal();
});

// ========== 功能函数 ==========
function doSearch() {
    const keyword = searchInput.value.trim();
    if (keyword) {
        const currentEngine = localStorage.getItem('searchEngine') || 'bing';
        let searchUrl;
        if (currentEngine === 'custom') {
            searchUrl = localStorage.getItem('customSearchUrl') || '';
        } else {
            searchUrl = searchEngines[currentEngine];
        }
        if (!searchUrl) return;
        const keepInput = localStorage.getItem('keepInput') === 'true';
        if (keepInput) {
            sessionStorage.setItem('savedInputValue', keyword);
        }
        window.location.href = `${searchUrl}${encodeURIComponent(keyword)}`;
        if (!keepInput) {
            searchInput.value = '';
        }
    }
}

let isDragging = false, startY, startHeight;
const showBottmSheet = () => {
  bottomSheet.classList.add("show");
  updateSheetHeight(50);
};
const updateSheetHeight = (height) => {
  sheetContent.style.height = `${height}vh`;
  bottomSheet.classList.toggle("fullscreen", height === 100);
};
const hideBottomSheet = () => {
  bottomSheet.classList.remove("show");
};
const dragStart = (e) => {
  isDragging = true;
  startY = e.pageY || e.touches?.[0].pageY;
  startHeight = parseInt(sheetContent.style.height);
  bottomSheet.classList.add("dragging");
};
const dragging = (e) => {
  if (!isDragging) return;
  const delta = startY - (e.pageY || e.touches?.[0].pageY);
  const newHeight = startHeight + (delta / window.innerHeight) * 100;
  updateSheetHeight(newHeight);
};
const dragStop = () => {
  isDragging = false;
  bottomSheet.classList.remove("dragging");
  const sheetHeight = parseInt(sheetContent.style.height);
  sheetHeight < 25 ? hideBottomSheet() : sheetHeight > 75 ? updateSheetHeight(100) : updateSheetHeight(50);
};

// ========== 搜索框行为 ==========
function moveSearchToBottomDelayed() {
    if (disableMoveEffectToggle && disableMoveEffectToggle.checked) return;
    const isLandscape = window.visualViewport.width > window.visualViewport.height;
    const delayTime = isLandscape ? 0 : 200;
    const topValue = isLandscape ? 'calc(100vh - 100px)' : 'calc(100vh - 135px)';
    setTimeout(() => {
        searchContainer.style.top = topValue;
    }, delayTime);
}
function resetSearchPosition() {
    if (disableMoveEffectToggle && disableMoveEffectToggle.checked) return;
    searchContainer.style.top = '250px';
}
searchInput.addEventListener('focus', () => {
    document.body.style.overflow = 'hidden';
    showModalBtn.classList.add('hidden');
    moveSearchToBottomDelayed();
    if (searchBtnTimer) clearTimeout(searchBtnTimer);
    searchBtn.classList.remove('show');
    if (enableSuggestionToggle && enableSuggestionToggle.checked) {
        const keyword = searchInput.value.trim();
        if (keyword) fetchSuggestions(keyword);
    }
    if (shortcutArea.classList.contains('visible')) {
        shortcutArea.dataset.wasVisible = 'true';
        shortcutArea.classList.remove('visible');
    }
});
searchInput.addEventListener('blur', () => {
    document.body.style.overflow = '';
    resetSearchPosition();
    setTimeout(() => {
        showModalBtn.classList.remove('hidden');
        if (shortcutArea.dataset.wasVisible === 'true') {
            shortcutArea.classList.add('visible');
            shortcutArea.dataset.wasVisible = '';
        }
    }, 300);
    updateSearchBtnVisibility();
    if (suggestionTimer) clearTimeout(suggestionTimer);
    if (hideSuggestionTimer) clearTimeout(hideSuggestionTimer);
    if (suggestionList && suggestionList.style.display !== 'none') {
        suggestionList.classList.add('hide');
        setTimeout(() => {
            suggestionList.style.display = 'none';
            suggestionList.classList.remove('hide');
        }, 400);
    }
});
let lastViewportHeight = viewport.height;
function onViewportResize() {
    const currentHeight = viewport.height;
    if (currentHeight > lastViewportHeight + 100 && document.activeElement === searchInput) {
        searchInput.blur();
    }
    lastViewportHeight = currentHeight;
}
viewport.addEventListener('resize', onViewportResize);
searchInput.addEventListener('contextmenu', (e) => e.preventDefault());
searchInput.addEventListener('input', () => {
    const keepInput = localStorage.getItem('keepInput') === 'true';
    if (keepInput) {
        sessionStorage.setItem('savedInputValue', searchInput.value);
    }
    updateSearchBtnVisibility();
    if (enableSuggestionToggle && enableSuggestionToggle.checked) {
        const keyword = searchInput.value.trim();
        if (keyword) {
            fetchSuggestions(keyword);
        } else {
            if (suggestionTimer) clearTimeout(suggestionTimer);
            if (hideSuggestionTimer) clearTimeout(hideSuggestionTimer);
            if (suggestionList && suggestionList.style.display !== 'none') {
                suggestionList.classList.add('hide');
                setTimeout(() => {
                    suggestionList.style.display = 'none';
                    suggestionList.classList.remove('hide');
                }, 400);
            }
        }
    } else {
        if (suggestionList && suggestionList.style.display !== 'none') {
            suggestionList.classList.add('hide');
            setTimeout(() => {
                suggestionList.style.display = 'none';
                suggestionList.classList.remove('hide');
            }, 400);
        }
    }
});
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
});
keepInputToggle.addEventListener('change', () => {
    const isChecked = keepInputToggle.checked;
    localStorage.setItem('keepInput', isChecked);
    if (!isChecked) {
        sessionStorage.removeItem('savedInputValue');
        searchInput.value = '';
    } else {
        sessionStorage.setItem('savedInputValue', searchInput.value);
    }
});
dragIcon.addEventListener("mousedown", dragStart);
document.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
dragIcon.addEventListener("touchstart", dragStart);
document.addEventListener("touchmove", dragging);
document.addEventListener("touchend", dragStop);
sheetOverlay.addEventListener("click", hideBottomSheet);
showModalBtn.addEventListener("click", showBottmSheet);

// ========== 搜索按钮显隐控制 ==========
function updateSearchBtnVisibility() {
    if (searchBtnTimer) clearTimeout(searchBtnTimer);
    if (!enableSearchBtnToggle || !enableSearchBtnToggle.checked) {
        searchBtn.classList.remove('show');
        return;
    }
    const hasContent = searchInput.value.trim().length > 0;
    const isFocused = document.activeElement === searchInput;
    if (hasContent && !isFocused) {
        searchBtnTimer = setTimeout(() => {
            searchBtn.classList.add('show');
            searchBtnTimer = null;
        }, 1330);
    } else {
        searchBtn.classList.remove('show');
    }
}

if (searchBtn) searchBtn.addEventListener('click', doSearch);
if (enableSearchBtnToggle) {
    enableSearchBtnToggle.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        localStorage.setItem('enableSearchBtn', isChecked);
        updateSearchBtnVisibility();
    });
}
window.addEventListener('pageshow', updateSearchBtnVisibility);

// ========== 搜索建议功能 ==========
function fetchSuggestions(keyword) {
    if (suggestionTimer) clearTimeout(suggestionTimer);
    suggestionTimer = setTimeout(() => {
        if (!enableSuggestionToggle || !enableSuggestionToggle.checked) {
            if (suggestionList && suggestionList.style.display !== 'none') {
                suggestionList.classList.add('hide');
                setTimeout(() => {
                    suggestionList.style.display = 'none';
                    suggestionList.classList.remove('hide');
                }, 400);
            }
            return;
        }
        const currentKeyword = searchInput.value.trim();
        if (currentKeyword !== keyword) return;
        const script = document.createElement('script');
        const callbackName = 'baiduSug_' + Date.now();
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.body.removeChild(script);
            if (data && data.s && data.s.length) {
                const items = data.s.slice(0, 5);
                const reversedItems = items.slice().reverse();
                const html = reversedItems.map(item => {
                    const escaped = item.replace(/[<>]/g, '');
                    const highlighted = escaped.replace(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), match => `<b>${match}</b>`);
                    return `<li><span>${highlighted}</span><img src="assets/chevron-forward-outline.svg" class="suggestion-icon" alt=""></li>`;
                }).join('');
                suggestionList.innerHTML = html;
                suggestionList.classList.remove('hide');
                suggestionList.style.display = 'flex';
            } else {
                suggestionList.classList.add('hide');
                setTimeout(() => {
                    suggestionList.style.display = 'none';
                    suggestionList.classList.remove('hide');
                }, 400);
            }
        };
        script.src = `https://suggestion.baidu.com/su?cb=${callbackName}&wd=${encodeURIComponent(keyword)}`;
        document.body.appendChild(script);
    }, 200);
}

if (suggestionList) {
    suggestionList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        const textSpan = li.querySelector('span');
        if (textSpan) {
            searchInput.value = textSpan.innerText;
            if (hideSuggestionTimer) clearTimeout(hideSuggestionTimer);
            suggestionList.classList.add('hide');
            setTimeout(() => {
                suggestionList.style.display = 'none';
                suggestionList.classList.remove('hide');
            }, 400);
            doSearch();
        }
    });
}
if (enableSuggestionToggle) {
    enableSuggestionToggle.addEventListener('change', (e) => {
        localStorage.setItem('enableSuggestion', e.target.checked);
        if (!e.target.checked) {
            if (suggestionTimer) clearTimeout(suggestionTimer);
            if (hideSuggestionTimer) clearTimeout(hideSuggestionTimer);
            if (suggestionList && suggestionList.style.display !== 'none') {
                suggestionList.classList.add('hide');
                setTimeout(() => {
                    suggestionList.style.display = 'none';
                    suggestionList.classList.remove('hide');
                }, 400);
            }
        } else {
            if (document.activeElement === searchInput) {
                const keyword = searchInput.value.trim();
                if (keyword) fetchSuggestions(keyword);
            }
        }
    });
}

// ========== 快速便签功能 ==========
function loadShortcuts() {
    const saved = localStorage.getItem('shortcuts');
    shortcuts = saved ? JSON.parse(saved) : [];
    renderShortcuts();
}

function applyShortcutStyles() {
    document.querySelectorAll('.shortcut-item').forEach(item => {
        item.style.borderRadius = '16px';
    });

    const iconFill = localStorage.getItem('iconFill') === 'true';
    const customSize = iconFill ? '100%' : '66%';
    const customRadius = iconFill ? '16px' : '10px';

    document.querySelectorAll('.shortcut-item .shortcut-icon').forEach(icon => {
        const isAddBtn = icon.closest('#addShortcutBtn');
        const isLetter = icon.classList.contains('shortcut-letter');
        const isDefaultIcon = icon.src && (icon.src.includes('default-shortcut.svg') || 
                              icon.src.includes('image-outline.svg'));
        if (isLetter) {
            icon.style.width = '66%';
            icon.style.height = '66%';
            icon.style.borderRadius = '0';
        } else if (isAddBtn || isDefaultIcon) {
            icon.style.width = '55%';
            icon.style.height = '55%';
            icon.style.borderRadius = '0';
        } else {
            icon.style.width = customSize;
            icon.style.height = customSize;
            icon.style.borderRadius = customRadius;
        }
    });
}

function renderShortcuts() {
    if (!shortcutGrid) return;

    let html = '';
    shortcuts.forEach((item, index) => {
        const iconSrc = item.icon || 'assets/default-shortcut.svg';
        const isDefault = iconSrc.includes('default-shortcut.svg') || iconSrc.includes('image-outline.svg');
        const iconHtml = isDefault
            ? `<span class="shortcut-icon shortcut-letter">${item.name.charAt(0)}</span>`
            : `<img class="shortcut-icon" src="${iconSrc}" alt="">`;
        html += `
            <div class="shortcut-item" data-index="${index}" data-url="${item.url}">
                ${iconHtml}
                <span class="shortcut-name">${item.name}</span>
            </div>
        `;
    });
    html += `
        <div class="shortcut-item add-btn" id="addShortcutBtn">
            <img class="shortcut-icon" src="assets/add-outline.svg" alt="添加">
        </div>
    `;
    shortcutGrid.innerHTML = html;

    // 长按编辑遮罩
    document.querySelectorAll('.shortcut-item[data-url]').forEach(item => {
        if (!item.querySelector('.shortcut-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'shortcut-overlay';
            const icon = document.createElement('img');
            icon.src = 'assets/create-outline.svg';
            icon.alt = '编辑';
            overlay.appendChild(icon);
            item.appendChild(overlay);

            overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(item.dataset.index);
                openEditSheet(index);
            });
        }

        const overlay = item.querySelector('.shortcut-overlay');
        let longPressTimer;
        let isLongPress = false;

        const startLongPress = (e) => {
            isLongPress = false;
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                if (currentOverlay && currentOverlay !== overlay) {
                    currentOverlay.classList.remove('visible');
                }
                overlay.classList.add('visible');
                currentOverlay = overlay;
            }, 490);
        };

        const cancelLongPress = () => {
            clearTimeout(longPressTimer);
        };

        item.addEventListener('touchstart', startLongPress, { passive: true });
        item.addEventListener('touchmove', cancelLongPress);
        item.addEventListener('touchend', (e) => {
            if (isLongPress) {
                e.preventDefault();
                e.stopPropagation();
            }
            cancelLongPress();
        });
        item.addEventListener('touchcancel', cancelLongPress);

        item.addEventListener('mousedown', startLongPress);
        item.addEventListener('mousemove', cancelLongPress);
        item.addEventListener('mouseup', (e) => {
            if (isLongPress) {
                e.preventDefault();
                e.stopPropagation();
            }
            cancelLongPress();
        });
        item.addEventListener('mouseleave', cancelLongPress);

        item.addEventListener('click', (e) => {
            if (overlay.classList.contains('visible')) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            const url = item.dataset.url;
            if (url) window.location.href = url;
        });
    });

    const addBtn = document.getElementById('addShortcutBtn');
    if (addBtn) {
        addBtn.addEventListener('click', openShortcutSheet);
        const hideBtn = localStorage.getItem('hideAddBtn') === 'true';
        addBtn.style.display = hideBtn ? 'none' : '';
    }

    applyShortcutStyles();

    const showText = localStorage.getItem('showShortcutText') === 'true';
    document.querySelectorAll('.shortcut-item .shortcut-name').forEach(name => {
        name.style.display = showText ? 'block' : 'none';
    });
    shortcutGrid.style.rowGap = showText ? '28px' : '20px';
}

// ========== 预览图大小与圆角控制 ==========
function applyPreviewSize() {
    if (!shortcutIconPreview) return;
    const isCustom = shortcutIconPreview.classList.contains('custom-preview');
    const iconFill = localStorage.getItem('iconFill') === 'true';
    if (isCustom) {
        const size = iconFill ? '100%' : '66%';
        shortcutIconPreview.style.width = size;
        shortcutIconPreview.style.height = size;
        shortcutIconPreview.style.borderRadius = iconFill ? '16px' : '10px';
    } else {
        shortcutIconPreview.style.width = '55%';
        shortcutIconPreview.style.height = '55%';
        shortcutIconPreview.style.borderRadius = '0';
    }
}

function applyEditPreviewSize() {
    if (!editIconPreview) return;
    const isCustom = editIconPreview.classList.contains('custom-preview');
    const iconFill = localStorage.getItem('iconFill') === 'true';
    if (isCustom) {
        const size = iconFill ? '100%' : '66%';
        editIconPreview.style.width = size;
        editIconPreview.style.height = size;
        editIconPreview.style.borderRadius = iconFill ? '16px' : '10px';
    } else {
        editIconPreview.style.width = '55%';
        editIconPreview.style.height = '55%';
        editIconPreview.style.borderRadius = '0';
    }
}

function openShortcutSheet() {
    shortcutNameInput.value = '';
    shortcutUrlInput.value = '';
    currentShortcutIcon = 'assets/image-outline.svg';
    shortcutIconPreview.src = currentShortcutIcon;
    shortcutIconPreview.classList.remove('custom-preview');
    applyPreviewSize();
    shortcutSheet.classList.add('show');
    const sheetContent = shortcutSheet.querySelector('.content');
    sheetContent.style.height = (window.innerHeight * 0.539) + 'px';
    sheetContent.style.overflow = 'hidden';
    const dragIconEl = shortcutSheet.querySelector('.drag-icon');
    dragIconEl.addEventListener('touchstart', (e) => e.stopPropagation());
    dragIconEl.addEventListener('mousedown', (e) => e.stopPropagation());
}

function closeShortcutSheet() {
    shortcutSheet.classList.remove('show');
}

function openEditSheet(index) {
    const item = shortcuts[index];
    if (!item) return;
    editingIndex = index;
    editNameInput.value = item.name;
    editUrlInput.value = item.url;
    const isDefault = item.icon.includes('default-shortcut.svg') || item.icon.includes('image-outline.svg');
    if (!isDefault) {
        editIconPreview.src = item.icon;
        editIconPreview.classList.add('custom-preview');
    } else {
        editIconPreview.src = 'assets/image-outline.svg';
        editIconPreview.classList.remove('custom-preview');
    }
    currentShortcutIcon = item.icon;
    applyEditPreviewSize();
    editSheet.classList.add('show');
    const sheetContent = editSheet.querySelector('.content');
    sheetContent.style.height = (window.innerHeight * 0.539) + 'px';
    sheetContent.style.overflow = 'hidden';
    const dragIconEl = editSheet.querySelector('.drag-icon');
    dragIconEl.addEventListener('touchstart', (e) => e.stopPropagation());
    dragIconEl.addEventListener('mousedown', (e) => e.stopPropagation());
    if (currentOverlay) {
        currentOverlay.classList.remove('visible');
        currentOverlay = null;
    }
}

function addShortcut(name, url, icon) {
    shortcuts.push({ name, url, icon });
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    renderShortcuts();
}

function initShortcuts() {
    loadShortcuts();
    if (enableShortcutToggle && enableShortcutToggle.checked) {
        shortcutArea.classList.add('visible');
    }
    shortcutClose.addEventListener('click', closeShortcutSheet);

    shortcutIconBtn.addEventListener('click', () => {
        shortcutIconFile.click();
    });
    shortcutIconFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const maxSize = 200;
                let width = img.width, height = img.height;
                if (width > maxSize || height > maxSize) {
                    if (width > height) { height *= maxSize / width; width = maxSize; }
                    else { width *= maxSize / height; height = maxSize; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                currentShortcutIcon = canvas.toDataURL('image/jpeg', 0.7);
                shortcutIconPreview.src = currentShortcutIcon;
                shortcutIconPreview.classList.add('custom-preview');
                applyPreviewSize();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    shortcutAddConfirm.addEventListener('click', () => {
        const name = shortcutNameInput.value.trim();
        let url = shortcutUrlInput.value.trim();
        if (!name || !url) return;
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
        addShortcut(name, url, shortcutIconPreview.src);
        closeShortcutSheet();
    });
}

// ========== 搜索引擎/深色模式 ==========
function setEngineSelection(value) {
    engineItems.forEach(item => item.classList.toggle('selected', item.dataset.engine === value));
    localStorage.setItem('searchEngine', value);
}

// 自定义搜索引擎的交互逻辑
function setupCustomEngineOption(customItem) {
    let longPressTimer;
    let ignoreClick = false;

    const startLongPress = (e) => {
        ignoreClick = false;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(() => {
            ignoreClick = true;
            openCustomSearchSheet();
        }, 490);
    };

    const cancelLongPress = () => {
        clearTimeout(longPressTimer);
    };

    customItem.addEventListener('touchstart', startLongPress, { passive: true });
    customItem.addEventListener('touchmove', cancelLongPress);
    customItem.addEventListener('touchend', cancelLongPress);
    customItem.addEventListener('touchcancel', cancelLongPress);

    customItem.addEventListener('mousedown', startLongPress);
    customItem.addEventListener('mousemove', cancelLongPress);
    customItem.addEventListener('mouseup', cancelLongPress);
    customItem.addEventListener('mouseleave', cancelLongPress);

    customItem.addEventListener('click', (e) => {
        if (ignoreClick) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        handleCustomClick();
    });
}

function handleCustomClick() {
    const customName = localStorage.getItem('customEngineName');
    if (customName) {
        setEngineSelection('custom');
    } else {
        openCustomSearchSheet();
    }
}

function openCustomSearchSheet() {
    const savedName = localStorage.getItem('customEngineName') || '';
    const savedUrl = localStorage.getItem('customSearchUrl') || '';
    customNameInput.value = savedName;
    customUrlInput.value = savedUrl;

    customSearchSheet.classList.add('show');
    const sheetContent = customSearchSheet.querySelector('.content');
    sheetContent.style.height = (window.innerHeight * 0.539) + 'px';
    sheetContent.style.overflow = 'hidden';
    const dragIconEl = customSearchSheet.querySelector('.drag-icon');
    dragIconEl.addEventListener('touchstart', (e) => e.stopPropagation());
    dragIconEl.addEventListener('mousedown', (e) => e.stopPropagation());
}

function closeCustomSearchSheet() {
    customSearchSheet.classList.remove('show');
}

// 绑定引擎选项（区分自定义）
if (engineItems.length) {
    engineItems.forEach(item => {
        if (item.dataset.engine === 'custom') {
            setupCustomEngineOption(item);
        } else {
            item.addEventListener('click', () => setEngineSelection(item.dataset.engine));
        }
    });
}

function setDarkModeSelection(value) {
    darkModeItems.forEach(item => item.classList.toggle('selected', item.dataset.mode === value));
    localStorage.setItem('darkMode', value);
    applyDarkMode(value);
    startTimedCheck();
    timePicker.classList.toggle('show', value === 'timed');
    if (value === 'timed') updateTimeDisplays();
}
if (darkModeItems.length) darkModeItems.forEach(item => item.addEventListener('click', () => setDarkModeSelection(item.dataset.mode)));

function applyDarkMode(mode) {
    const html = document.documentElement;
    if (mode === 'system') html.classList.remove('dark-mode-manual');
    else if (mode === 'timed') {
        const saveStartTime = localStorage.getItem('timedStart') || '18:30';
        const saveEndTime = localStorage.getItem('timedEnd') || '08:00';
        startTimeInput.value = saveStartTime;
        endTimeInput.value = saveEndTime;
        updateTimeDisplays();
        const [startH, startM] = saveStartTime.split(':').map(Number);
        const [endH, endM] = saveEndTime.split(':').map(Number);
        const now = new Date();
        const nowH = now.getHours();
        const nowM = now.getMinutes();
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;
        const nowTotal = nowH * 60 + nowM;
        const isDark = (startTotal > endTotal) ? (nowTotal >= startTotal || nowTotal < endTotal) : (nowTotal >= startTotal && nowTotal < endTotal);
        html.classList.toggle('dark-mode-manual', isDark);
    } else if (mode === 'permanent') html.classList.add('dark-mode-manual');
}
function saveTimeToLocal() {
    localStorage.setItem('timedStart', startTimeInput.value);
    localStorage.setItem('timedEnd', endTimeInput.value);
    applyDarkMode('timed');
}
let timedCheckTimer = null;
function startTimedCheck() {
    if (timedCheckTimer) clearInterval(timedCheckTimer);
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'timed') { applyDarkMode('timed'); timedCheckTimer = setInterval(() => applyDarkMode('timed'), 60000); }
    else applyDarkMode(darkMode);
}

const darkModeStyle = document.createElement('style');
darkModeStyle.textContent = `
    html.dark-mode-manual { 
        --bg-main: #000000; 
        --input-border: #666666; 
        --input-focus: #4a6ae6; 
        --text-color: #f3f4f6; 
        --input-shadow: 0 4px 12px rgba(255, 255, 255, 0.08); 
        --input-focus-shadow: 0 0 12px rgba(74, 106, 230, 0.7); 
    } 
    html.dark-mode-manual body { 
        background-color: var(--bg-main); 
    } 
    html.dark-mode-manual .search-input { 
        background-color: var(--bg-main); 
        color: var(--text-color); 
        border-color: var(--input-border); 
    } 
    html.dark-mode-manual .buttom-sheet .content { 
        background: #1a1a1a; 
        color: #f3f4f6; 
    } 
    html.dark-mode-manual .header .drag-icon span { 
        background: #666; 
    } 
    html.dark-mode-manual .buttom-sheet .sheet-overlay { 
        opacity: 0.7; 
    }
    html.dark-mode-manual .shortcut-item {
        border-radius: 16px;
    }
    html.dark-mode-manual .shortcut-item .shortcut-icon {
        border-radius: inherit;
    }
`;
document.head.appendChild(darkModeStyle);

// ========== 页面初始化 ==========
window.addEventListener('DOMContentLoaded', () => {
    // 更新自定义引擎标签文字
    const customEngineName = localStorage.getItem('customEngineName');
    if (customEngineName) {
        const customLabel = document.querySelector('.option-item[data-engine="custom"] .option-label');
        if (customLabel) {
            customLabel.textContent = customEngineName;
        }
    }

    setEngineSelection(localStorage.getItem('searchEngine') || 'bing');
    const savedDarkMode = localStorage.getItem('darkMode') || 'system';
    setDarkModeSelection(savedDarkMode);
    applyDarkMode(savedDarkMode);
    startTimedCheck();
    keepInputToggle.checked = localStorage.getItem('keepInput') === 'true';
    if (keepInputToggle.checked) {
        const savedValue = sessionStorage.getItem('savedInputValue');
        if (savedValue) searchInput.value = savedValue;
    }
    if (enableSearchBtnToggle) {
        enableSearchBtnToggle.checked = localStorage.getItem('enableSearchBtn') === 'true';
        updateSearchBtnVisibility();
    }
    if (enableSuggestionToggle) {
        const saved = localStorage.getItem('enableSuggestion') === 'true';
        enableSuggestionToggle.checked = saved;
        if (!saved) suggestionList.style.display = 'none';
        else if (document.activeElement === searchInput && searchInput.value.trim()) fetchSuggestions(searchInput.value.trim());
        else suggestionList.style.display = 'none';
    }
    
    // ========== 初始化快速便签开关（控制连体动画） ==========
    if (enableShortcutToggle) {
        const isEnabled = localStorage.getItem('enableShortcut') === 'true';
        enableShortcutToggle.checked = isEnabled;
        shortcutArea.classList.toggle('visible', isEnabled);
        if (shortcutExtraWrapper) {
            shortcutExtraWrapper.classList.toggle('show', isEnabled);
        }
    }

    // 图标填充开关
    if (iconFillToggle) {
        const saved = localStorage.getItem('iconFill') === 'true';
        iconFillToggle.checked = saved;
        iconFillToggle.addEventListener('change', () => {
            localStorage.setItem('iconFill', iconFillToggle.checked);
            applyShortcutStyles();
            applyPreviewSize();
            applyEditPreviewSize();
        });
    }

    // 文字显示开关
    if (showShortcutTextToggle) {
        const showText = localStorage.getItem('showShortcutText') === 'true';
        showShortcutTextToggle.checked = showText;
        shortcutGrid.style.rowGap = showText ? '28px' : '20px';
        showShortcutTextToggle.addEventListener('change', () => {
            const show = showShortcutTextToggle.checked;
            document.querySelectorAll('.shortcut-item .shortcut-name').forEach(name => {
                name.style.display = show ? 'block' : 'none';
            });
            shortcutGrid.style.rowGap = show ? '28px' : '20px';
            localStorage.setItem('showShortcutText', show);
        });
    }

    // 下移便签区域开关
    if (shiftDownToggle) {
        const savedShift = localStorage.getItem('shiftDown') === 'true';
        shiftDownToggle.checked = savedShift;
        shortcutArea.style.top = savedShift ? '432px' : '326px';

        shiftDownToggle.addEventListener('change', () => {
            const isShifted = shiftDownToggle.checked;
            localStorage.setItem('shiftDown', isShifted);
            shortcutArea.style.top = isShifted ? '432px' : '326px';
        });
    }

    // 隐藏添加按钮开关
    if (hideAddBtnToggle) {
        const savedHide = localStorage.getItem('hideAddBtn') === 'true';
        hideAddBtnToggle.checked = savedHide;
        const addBtn = document.getElementById('addShortcutBtn');
        if (addBtn) addBtn.style.display = savedHide ? 'none' : '';

        hideAddBtnToggle.addEventListener('change', () => {
            const isHide = hideAddBtnToggle.checked;
            localStorage.setItem('hideAddBtn', isHide);
            const btn = document.getElementById('addShortcutBtn');
            if (btn) btn.style.display = isHide ? 'none' : '';
        });
    }

    // 停用位移效果开关
    if (disableMoveEffectToggle) {
        const saved = localStorage.getItem('disableMoveEffect') === 'true';
        disableMoveEffectToggle.checked = saved;
        if (saved) {
            searchContainer.style.top = '250px';
        }
        disableMoveEffectToggle.addEventListener('change', () => {
            const isDisabled = disableMoveEffectToggle.checked;
            localStorage.setItem('disableMoveEffect', isDisabled);
            if (isDisabled) {
                searchContainer.style.top = '250px';
            }
        });
    }

    // ========== 自定搜索引擎开关 ==========
    if (enableCustomEngineToggle) {
        const customEngineEnabled = localStorage.getItem('enableCustomEngine') === 'true';
        enableCustomEngineToggle.checked = customEngineEnabled;

        const customOption = document.querySelector('.option-item[data-engine="custom"]');
        const customDivider = customOption ? customOption.previousElementSibling : null;

        if (customOption) {
            customOption.style.display = customEngineEnabled ? '' : 'none';
        }
        if (customDivider && customDivider.classList.contains('option-divider')) {
            customDivider.style.display = customEngineEnabled ? '' : 'none';
        }

        if (!customEngineEnabled && localStorage.getItem('searchEngine') === 'custom') {
            setEngineSelection('bing');
        }

        enableCustomEngineToggle.addEventListener('change', () => {
            const enabled = enableCustomEngineToggle.checked;
            localStorage.setItem('enableCustomEngine', enabled);

            if (customOption) {
                customOption.style.display = enabled ? '' : 'none';
            }
            if (customDivider && customDivider.classList.contains('option-divider')) {
                customDivider.style.display = enabled ? '' : 'none';
            }

            if (!enabled && localStorage.getItem('searchEngine') === 'custom') {
                setEngineSelection('bing');
            }
        });
    }

    // ========== 隐藏设置按钮（反转逻辑：开关关闭时显示，默认隐藏） ==========
    if (hideSettingsBtnToggle) {
        const isHidden = localStorage.getItem('hideSettingsBtn') === 'true';
        hideSettingsBtnToggle.checked = isHidden;
        showModalBtn.style.opacity = isHidden ? '0' : '1';
        showModalBtn.style.pointerEvents = 'auto';

        hideSettingsBtnToggle.addEventListener('change', () => {
            const hide = hideSettingsBtnToggle.checked;
            localStorage.setItem('hideSettingsBtn', hide);
            showModalBtn.style.opacity = hide ? '0' : '1';
            showModalBtn.style.pointerEvents = 'auto';
        });
    }

    // 自定义搜索引擎弹窗事件
    customSearchClose.addEventListener('click', closeCustomSearchSheet);
    customSearchConfirm.addEventListener('click', () => {
        const name = customNameInput.value.trim();
        let url = customUrlInput.value.trim();

        if (!name && !url) {
            localStorage.removeItem('customEngineName');
            localStorage.removeItem('customSearchUrl');
            const customLabel = document.querySelector('.option-item[data-engine="custom"] .option-label');
            if (customLabel) {
                customLabel.textContent = '自定义';
            }
            if (localStorage.getItem('searchEngine') === 'custom') {
                setEngineSelection('bing');
            }
            closeCustomSearchSheet();
            return;
        }

        if (!name || !url) return;

        localStorage.setItem('customEngineName', name);
        localStorage.setItem('customSearchUrl', url);
        const customLabel = document.querySelector('.option-item[data-engine="custom"] .option-label');
        if (customLabel) {
            customLabel.textContent = name;
        }
        setEngineSelection('custom');
        closeCustomSearchSheet();
    });

    // ========== 壁纸功能 ==========
    wallpaperRow.addEventListener('click', () => {
        wallpaperFileInput.click();
    });

    wallpaperFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const maxSize = 1400;
                let width = img.width;
                let height = img.height;
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height *= maxSize / width;
                        width = maxSize;
                    } else {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
                document.body.style.backgroundImage = `url(${dataUrl})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
                localStorage.setItem('wallpaper', dataUrl);
                wallpaperDivider.style.display = 'inline-block';
                wallpaperDelete.style.display = 'inline';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    wallpaperDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        document.body.style.backgroundRepeat = '';
        localStorage.removeItem('wallpaper');
        wallpaperDivider.style.display = 'none';
        wallpaperDelete.style.display = 'none';
    });

    const savedWallpaper = localStorage.getItem('wallpaper');
    if (savedWallpaper) {
        document.body.style.backgroundImage = `url(${savedWallpaper})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        wallpaperDivider.style.display = 'inline-block';
        wallpaperDelete.style.display = 'inline';
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.shortcut-overlay')) {
            if (currentOverlay) {
                currentOverlay.classList.remove('visible');
                currentOverlay = null;
            }
        }
    });

    initShortcuts();
    updateSearchBtnVisibility();

    editClose.addEventListener('click', () => {
        if (editingIndex >= 0 && shortcuts[editingIndex]) {
            shortcuts.splice(editingIndex, 1);
            localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
            editSheet.classList.remove('show');
            editingIndex = -1;
            renderShortcuts();
        } else {
            editSheet.classList.remove('show');
            editingIndex = -1;
        }
    });

    editSheetOverlay.addEventListener('click', () => {
        editSheet.classList.remove('show');
        editingIndex = -1;
    });

    editIconBtn.addEventListener('click', () => {
        editIconFile.click();
    });
    editIconFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const maxSize = 200;
                let width = img.width, height = img.height;
                if (width > maxSize || height > maxSize) {
                    if (width > height) { height *= maxSize / width; width = maxSize; }
                    else { width *= maxSize / height; height = maxSize; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                currentShortcutIcon = canvas.toDataURL('image/jpeg', 0.7);
                editIconPreview.src = currentShortcutIcon;
                editIconPreview.classList.add('custom-preview');
                applyEditPreviewSize();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
    editSaveConfirm.addEventListener('click', () => {
        const name = editNameInput.value.trim();
        let url = editUrlInput.value.trim();
        if (!name || !url) return;
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
        if (editingIndex >= 0) {
            shortcuts[editingIndex].name = name;
            shortcuts[editingIndex].url = url;
            shortcuts[editingIndex].icon = editIconPreview.src;
            localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
            editingIndex = -1;
        }
        editSheet.classList.remove('show');
        renderShortcuts();
    });

    // ========== 删除所有数据（打开空白弹窗，高度与添加页一致） ==========
    const clearAllCacheBtn = document.getElementById('clearAllCacheBtn');
    if (clearAllCacheBtn && clearConfirmSheet && clearConfirmOverlay) {
        clearAllCacheBtn.addEventListener('click', () => {
            clearConfirmSheet.classList.add('show');
            const sheetContent = clearConfirmSheet.querySelector('.content');
            if (sheetContent) {
                sheetContent.style.height = (window.innerHeight * 0.539) + 'px';
                sheetContent.style.overflow = 'hidden';
            }
        });
        clearConfirmOverlay.addEventListener('click', () => {
            clearConfirmSheet.classList.remove('show');
        });
    }

    // 确认删除按钮
    if (clearConfirmBtn) {
        clearConfirmBtn.addEventListener('click', () => {
            localStorage.clear();
            clearConfirmSheet.classList.remove('show');
            location.reload();
        });
    }
});

// ========== 快速便签开关监听 ==========
if (enableShortcutToggle) {
    enableShortcutToggle.addEventListener('change', (e) => {
        const checked = e.target.checked;
        localStorage.setItem('enableShortcut', checked);
        shortcutArea.classList.toggle('visible', checked);
        if (shortcutExtraWrapper) {
            shortcutExtraWrapper.classList.toggle('show', checked);
        }
    });
}

// 注册 Service Worker（离线支持）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker 注册成功，范围:', reg.scope))
      .catch(err => console.error('Service Worker 注册失败:', err));
  });
}
