// ===== Device Mockup Generator - Main App =====

class MockupGenerator {
    constructor() {
        this.canvas = document.getElementById('mockupCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.uploadedImage = null;
        this.selectedDevice = null;
        this.selectedBackground = null;
        this.options = {
            shadow: true,
            rotation: 0,
            zoom: 100
        };

        this.init();
    }

    init() {
        this.setupUpload();
        this.renderDevices();
        this.renderBackgrounds();
        this.setupOptions();
        this.setupDownload();
        this.setupCategoryFilters();

        // Set default background
        const defaultBg = BACKGROUNDS.gradient[0];
        this.selectBackground(defaultBg);
    }

    // ===== Upload Handling =====
    setupUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.querySelector('.upload-btn');

        // Prevent uploadZone click from triggering when clicking on input directly
        fileInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Upload button click
        if (uploadBtn) {
            uploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            });
        }

        // Upload zone click (anywhere except button)
        uploadZone.addEventListener('click', (e) => {
            // Don't trigger if clicking the label/button
            if (e.target.classList.contains('upload-btn') || e.target.tagName === 'LABEL') {
                return;
            }
            fileInput.click();
        });

        // File input change - this is the key event
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                this.loadImage(files[0]);
            }
            // Reset input so same file can be selected again
            e.target.value = '';
        });

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                this.loadImage(files[0]);
            }
        });

        // Paste from clipboard
        document.addEventListener('paste', (e) => {
            const items = e.clipboardData?.items;
            if (items) {
                for (let item of items) {
                    if (item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) {
                            this.loadImage(file);
                        }
                        break;
                    }
                }
            }
        });
    }

    loadImage(file) {
        // Accept all files - let the browser handle validation
        if (!file) {
            console.warn('No file provided');
            return;
        }

        // Check if it looks like an image
        const isImage = file.type.startsWith('image/') ||
            /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name);

        if (!isImage) {
            alert('Vui lòng chọn file ảnh (JPG, PNG, GIF, WEBP...)');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;

                // Show thumbnail
                const previewThumb = document.getElementById('previewThumb');
                previewThumb.src = e.target.result;
                previewThumb.classList.add('visible');
                document.getElementById('uploadZone').classList.add('has-image');

                this.renderMockup();
            };
            img.onerror = () => {
                console.error('Failed to load image');
                alert('Không thể tải ảnh này, vui lòng thử ảnh khác');
            };
            img.src = e.target.result;
        };
        reader.onerror = () => {
            console.error('Failed to read file');
            alert('Lỗi đọc file, vui lòng thử lại');
        };
        reader.readAsDataURL(file);
    }

    // ===== Device Grid =====
    renderDevices(category = 'all') {
        const grid = document.getElementById('deviceGrid');
        const devices = getDevicesByCategory(category);

        grid.innerHTML = devices.map(device => `
            <div class="device-item ${this.selectedDevice?.id === device.id ? 'active' : ''}" 
                 data-device-id="${device.id}">
                <span class="icon">${device.icon}</span>
                <span class="name">${device.name}</span>
            </div>
        `).join('');

        // Add click handlers
        grid.querySelectorAll('.device-item').forEach(item => {
            item.addEventListener('click', () => {
                const deviceId = item.dataset.deviceId;
                const device = getAllDevices().find(d => d.id === deviceId);
                this.selectDevice(device);
            });
        });
    }

    selectDevice(device) {
        this.selectedDevice = device;

        // Update UI
        document.querySelectorAll('.device-item').forEach(item => {
            item.classList.toggle('active', item.dataset.deviceId === device.id);
        });

        this.renderMockup();
    }

    // ===== Category Filters =====
    setupCategoryFilters() {
        // Device categories
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderDevices(btn.dataset.category);
            });
        });

        // Background categories
        document.querySelectorAll('.bg-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.bg-cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderBackgrounds(btn.dataset.bgcat);
            });
        });
    }

    // ===== Background Grid =====
    renderBackgrounds(category = 'gradient') {
        const grid = document.getElementById('bgGrid');
        const backgrounds = getBackgroundsByCategory(category);

        grid.innerHTML = backgrounds.map(bg => `
            <div class="bg-item ${this.selectedBackground?.id === bg.id ? 'active' : ''}" 
                 data-bg-id="${bg.id}"
                 style="background: ${bg.css}; ${bg.size ? `background-size: ${bg.size}` : ''}">
            </div>
        `).join('');

        // Add click handlers
        grid.querySelectorAll('.bg-item').forEach(item => {
            item.addEventListener('click', () => {
                const bgId = item.dataset.bgId;
                const bg = getAllBackgrounds().find(b => b.id === bgId);
                this.selectBackground(bg);
            });
        });
    }

    selectBackground(bg) {
        this.selectedBackground = bg;

        // Update UI
        document.querySelectorAll('.bg-item').forEach(item => {
            item.classList.toggle('active', item.dataset.bgId === bg.id);
        });

        this.renderMockup();
    }

    // ===== Options =====
    setupOptions() {
        const shadowToggle = document.getElementById('shadowToggle');
        const rotationSlider = document.getElementById('rotationSlider');
        const rotationValue = document.getElementById('rotationValue');
        const zoomSlider = document.getElementById('zoomSlider');
        const zoomValue = document.getElementById('zoomValue');

        shadowToggle.addEventListener('change', (e) => {
            this.options.shadow = e.target.checked;
            this.renderMockup();
        });

        rotationSlider.addEventListener('input', (e) => {
            this.options.rotation = parseInt(e.target.value);
            rotationValue.textContent = `${this.options.rotation}°`;
            this.renderMockup();
        });

        zoomSlider.addEventListener('input', (e) => {
            this.options.zoom = parseInt(e.target.value);
            zoomValue.textContent = `${this.options.zoom}%`;
            this.renderMockup();
        });
    }

    // ===== Canvas Rendering =====
    renderMockup() {
        const placeholder = document.getElementById('canvasPlaceholder');

        if (!this.selectedDevice || !this.selectedBackground) {
            placeholder.classList.remove('hidden');
            this.canvas.classList.remove('visible');
            return;
        }

        placeholder.classList.add('hidden');
        this.canvas.classList.add('visible');

        const device = this.selectedDevice;
        const zoom = this.options.zoom / 100;

        // Calculate canvas size with padding for shadow and rotation
        const padding = 100;
        const canvasWidth = device.width * zoom + padding * 2;
        const canvasHeight = device.height * zoom + padding * 2;

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        const ctx = this.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw background
        this.drawBackground(ctx, canvasWidth, canvasHeight);

        // Save context for rotation
        ctx.save();

        // Move to center for rotation
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate((this.options.rotation * Math.PI) / 180);
        ctx.translate(-device.width * zoom / 2, -device.height * zoom / 2);

        // Draw shadow
        if (this.options.shadow) {
            this.drawShadow(ctx, device, zoom);
        }

        // Draw device frame
        this.drawDeviceFrame(ctx, device, zoom);

        // Draw screen content (uploaded image)
        if (this.uploadedImage) {
            this.drawScreenContent(ctx, device, zoom);
        }

        // Draw device details (notch, dynamic island, etc.)
        this.drawDeviceDetails(ctx, device, zoom);

        ctx.restore();

        // Enable download button
        document.getElementById('downloadBtn').disabled = false;
    }

    drawBackground(ctx, width, height) {
        const bg = this.selectedBackground;

        // Parse gradient and fill
        if (bg.css.includes('gradient') || bg.css.includes('radial')) {
            // For complex gradients, create a temp canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d');

            // Use element to render CSS gradient
            const div = document.createElement('div');
            div.style.cssText = `
                position: absolute;
                width: ${width}px;
                height: ${height}px;
                background: ${bg.css};
            `;

            // Simple gradient parsing for common cases
            if (bg.css.startsWith('linear-gradient')) {
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                // Default purple-pink gradient
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(0.5, '#764ba2');
                gradient.addColorStop(1, '#f093fb');

                // Parse colors from CSS if possible
                const colors = bg.css.match(/#[a-fA-F0-9]{6}/g);
                if (colors && colors.length >= 2) {
                    colors.forEach((color, i) => {
                        gradient.addColorStop(i / (colors.length - 1), color);
                    });
                }

                ctx.fillStyle = gradient;
            } else if (bg.css.startsWith('radial-gradient') || bg.css.includes('radial-gradient')) {
                // For mesh gradients, use a solid base with multiple radial overlays
                const baseColor = bg.css.match(/#[a-fA-F0-9]{6}(?=[^)]*$)/)?.[0] || '#0f0f23';
                ctx.fillStyle = baseColor;
                ctx.fillRect(0, 0, width, height);

                // Draw multiple radial gradients
                const radials = bg.css.match(/radial-gradient\([^)]+\)/g) || [];
                radials.forEach(radialStr => {
                    const atMatch = radialStr.match(/at\s+(\d+)%\s+(\d+)%/);
                    const colorMatch = radialStr.match(/#[a-fA-F0-9]{6}/);

                    if (atMatch && colorMatch) {
                        const x = (parseInt(atMatch[1]) / 100) * width;
                        const y = (parseInt(atMatch[2]) / 100) * height;
                        const gradient = ctx.createRadialGradient(x, y, 0, x, y, width * 0.5);
                        gradient.addColorStop(0, colorMatch[0] + '80');
                        gradient.addColorStop(1, 'transparent');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, width, height);
                    }
                });
                return;
            } else {
                ctx.fillStyle = bg.css;
            }
        } else {
            ctx.fillStyle = bg.css;
        }

        ctx.fillRect(0, 0, width, height);
    }

    drawShadow(ctx, device, zoom) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 50 * zoom;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 20 * zoom;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
        this.roundRect(ctx, 0, 0, device.width * zoom, device.height * zoom, device.radius * zoom);
        ctx.fill();

        ctx.restore();
    }

    drawDeviceFrame(ctx, device, zoom) {
        // Device outer frame
        ctx.fillStyle = device.frameColor;

        if (device.circular) {
            // Circular watch
            ctx.beginPath();
            ctx.arc(device.width * zoom / 2, device.height * zoom / 2,
                device.width * zoom / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.roundRect(ctx, 0, 0, device.width * zoom, device.height * zoom, device.radius * zoom);
            ctx.fill();
        }

        // Bezel effect (subtle highlight)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        if (device.circular) {
            ctx.beginPath();
            ctx.arc(device.width * zoom / 2, device.height * zoom / 2,
                device.width * zoom / 2 - 2, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            this.roundRect(ctx, 2, 2, device.width * zoom - 4, device.height * zoom - 4, (device.radius - 2) * zoom);
            ctx.stroke();
        }

        // Draw keyboard for laptops
        if (device.keyboard) {
            this.drawKeyboard(ctx, device, zoom);
        }

        // Draw stand for monitors
        if (device.stand) {
            this.drawStand(ctx, device, zoom);
        }

        // Draw chin for iMac
        if (device.chin) {
            ctx.fillStyle = device.frameColor;
            ctx.fillRect(0, device.height * zoom - device.chin * zoom,
                device.width * zoom, device.chin * zoom);
        }

        // Draw crown for Apple Watch
        if (device.crown) {
            ctx.fillStyle = '#555';
            ctx.fillRect(device.width * zoom - 5, device.height * zoom * 0.35,
                10, 30 * zoom);
        }

        // Draw joycons for Switch
        if (device.joycons) {
            // Left joycon (blue)
            ctx.fillStyle = '#0ab9e6';
            this.roundRect(ctx, 0, 0, 100 * zoom, device.height * zoom, 20 * zoom);
            ctx.fill();

            // Right joycon (red)
            ctx.fillStyle = '#ff3c28';
            this.roundRect(ctx, (device.width - 100) * zoom, 0, 100 * zoom, device.height * zoom, 20 * zoom);
            ctx.fill();
        }

        // RGB glow for gaming monitor
        if (device.rgbGlow) {
            ctx.save();
            ctx.shadowColor = '#ff0080';
            ctx.shadowBlur = 30;
            ctx.strokeStyle = 'rgba(255, 0, 128, 0.5)';
            ctx.lineWidth = 3;
            this.roundRect(ctx, 0, 0, device.width * zoom, device.height * zoom, device.radius * zoom);
            ctx.stroke();
            ctx.restore();
        }
    }

    drawKeyboard(ctx, device, zoom) {
        const keyboardHeight = 60 * zoom;
        const keyboardY = device.height * zoom - keyboardHeight;

        // Keyboard base
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, keyboardY, device.width * zoom, keyboardHeight);

        // Keyboard gradient overlay
        const gradient = ctx.createLinearGradient(0, keyboardY, 0, device.height * zoom);
        gradient.addColorStop(0, 'rgba(255,255,255,0.05)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, keyboardY, device.width * zoom, keyboardHeight);

        // Trackpad
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        const trackpadW = 150 * zoom;
        const trackpadH = 40 * zoom;
        this.roundRect(ctx,
            (device.width * zoom - trackpadW) / 2,
            keyboardY + 10,
            trackpadW, trackpadH, 5 * zoom);
        ctx.fill();
    }

    drawStand(ctx, device, zoom) {
        const standWidth = 120 * zoom;
        const standHeight = 80 * zoom;
        const baseWidth = 200 * zoom;
        const baseHeight = 15 * zoom;

        // Stand neck
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(
            (device.width * zoom - standWidth) / 2,
            device.height * zoom,
            standWidth, standHeight
        );

        // Stand base
        ctx.fillStyle = '#1f1f1f';
        this.roundRect(ctx,
            (device.width * zoom - baseWidth) / 2,
            device.height * zoom + standHeight,
            baseWidth, baseHeight, 5 * zoom);
        ctx.fill();
    }

    drawScreenContent(ctx, device, zoom) {
        ctx.save();

        // Clip to screen area
        ctx.beginPath();
        if (device.circular) {
            ctx.arc(device.width * zoom / 2, device.height * zoom / 2,
                device.screenW * zoom / 2, 0, Math.PI * 2);
        } else {
            const screenRadius = Math.max(0, (device.radius - device.bezelWidth) * zoom);
            this.roundRect(ctx,
                device.screenX * zoom,
                device.screenY * zoom,
                device.screenW * zoom,
                device.screenH * zoom,
                screenRadius);
        }
        ctx.clip();

        // Calculate image scaling to cover screen
        const img = this.uploadedImage;
        const screenW = device.screenW * zoom;
        const screenH = device.screenH * zoom;

        const imgRatio = img.width / img.height;
        const screenRatio = screenW / screenH;

        let drawW, drawH, drawX, drawY;

        if (imgRatio > screenRatio) {
            // Image is wider - fit height
            drawH = screenH;
            drawW = drawH * imgRatio;
            drawX = device.screenX * zoom - (drawW - screenW) / 2;
            drawY = device.screenY * zoom;
        } else {
            // Image is taller - fit width
            drawW = screenW;
            drawH = drawW / imgRatio;
            drawX = device.screenX * zoom;
            drawY = device.screenY * zoom - (drawH - screenH) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        ctx.restore();
    }

    drawDeviceDetails(ctx, device, zoom) {
        // Dynamic Island
        if (device.dynamicIsland) {
            ctx.fillStyle = '#000';
            const islandW = 110 * zoom;
            const islandH = 35 * zoom;
            const islandX = (device.width * zoom - islandW) / 2;
            const islandY = device.screenY * zoom + 12 * zoom;
            this.roundRect(ctx, islandX, islandY, islandW, islandH, islandH / 2);
            ctx.fill();
        }

        // Notch
        if (device.notch && !device.dynamicIsland) {
            ctx.fillStyle = device.frameColor;
            const notchW = device.notch.width * zoom;
            const notchH = device.notch.height * zoom;
            const notchX = (device.width * zoom - notchW) / 2;
            this.roundRect(ctx, notchX, 0, notchW, notchH, 15 * zoom);
            ctx.fill();
        }

        // MacBook notch
        if (device.hasNotch && device.keyboard) {
            ctx.fillStyle = device.frameColor;
            const notchW = 70 * zoom;
            const notchH = 22 * zoom;
            const notchX = (device.width * zoom - notchW) / 2;
            this.roundRect(ctx, notchX, 0, notchW, notchH, 8 * zoom);
            ctx.fill();
        }

        // Punch hole camera
        if (device.punchHole) {
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(device.punchHole.x * zoom, device.punchHole.y * zoom,
                device.punchHole.r * zoom, 0, Math.PI * 2);
            ctx.fill();
        }

        // Fold line
        if (device.foldLine) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(device.width * zoom / 2, 0);
            ctx.lineTo(device.width * zoom / 2, device.height * zoom);
            ctx.stroke();
        }
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    // ===== Download =====
    setupDownload() {
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.disabled = true;

        downloadBtn.addEventListener('click', () => {
            this.downloadMockup();
        });
    }

    downloadMockup() {
        const quality = parseFloat(document.getElementById('exportQuality').value);
        const format = quality === 1 ? 'png' : 'jpeg';

        const link = document.createElement('a');
        link.download = `mockup-${this.selectedDevice?.id || 'device'}-${Date.now()}.${format}`;
        link.href = this.canvas.toDataURL(`image/${format}`, quality);
        link.click();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new MockupGenerator();
});
