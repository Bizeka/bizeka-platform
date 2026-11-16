import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const root = resolve(import.meta.dirname, "..");
export const tokensPath = resolve(root, "wwwroot/bizeka-theme/tokens.css");
export const overridesPath = resolve(root, "wwwroot/bizeka-theme/bizeka-overrides.css");

export async function readThemeSources() {
    const [tokens, overrides] = await Promise.all([
        readFile(tokensPath, "utf8"),
        readFile(overridesPath, "utf8")
    ]);

    return { tokens, overrides };
}

function blockAfter(css, marker) {
    const markerIndex = css.indexOf(marker);
    if (markerIndex < 0)
        throw new Error(`Missing selector block: ${marker}`);

    const markerOpen = marker.lastIndexOf("{");
    const open = markerOpen >= 0
        ? markerIndex + markerOpen
        : css.indexOf("{", markerIndex + marker.length);
    if (open < 0)
        throw new Error(`Missing opening brace for: ${marker}`);

    let depth = 0;
    for (let i = open; i < css.length; i++) {
        if (css[i] === "{") depth++;
        else if (css[i] === "}") {
            depth--;
            if (depth === 0)
                return css.slice(open + 1, i);
        }
    }

    throw new Error(`Missing closing brace for: ${marker}`);
}

export function parseTokenBlock(tokensCss, marker) {
    const body = blockAfter(tokensCss, marker);
    const result = {};
    for (const match of body.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi))
        result[match[1]] = match[2].trim();
    return result;
}

export function parseHexColor(value) {
    const raw = value.trim().replace(/^#/, "");
    if (![3, 4, 6, 8].includes(raw.length) || !/^[0-9a-f]+$/i.test(raw))
        return null;

    const expanded = raw.length < 5 ? [...raw].map(x => x + x).join("") : raw;
    const channels = [0, 2, 4].map(i => Number.parseInt(expanded.slice(i, i + 2), 16) / 255);
    const alpha = expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1;
    return { r: channels[0], g: channels[1], b: channels[2], alpha };
}

export function parseColor(value) {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "white") return { r: 1, g: 1, b: 1, alpha: 1 };
    if (trimmed === "black") return { r: 0, g: 0, b: 0, alpha: 1 };
    if (trimmed === "transparent") return { r: 0, g: 0, b: 0, alpha: 0 };

    const hex = parseHexColor(trimmed);
    if (hex) return hex;

    const rgb = trimmed.match(/^rgba?\(\s*([^)]*)\)$/);
    if (!rgb) return null;

    const channels = rgb[1].split(/\s*[,/]\s*/);
    if (channels.length < 3) return null;

    const parseChannel = channel => channel.endsWith("%")
        ? Number.parseFloat(channel) / 100
        : Number.parseFloat(channel) / 255;
    const parsed = channels.slice(0, 3).map(parseChannel);
    if (parsed.some(x => !Number.isFinite(x))) return null;

    const alpha = channels[3] === undefined ? 1
        : channels[3].endsWith("%") ? Number.parseFloat(channels[3]) / 100
            : Number.parseFloat(channels[3]);
    return { r: parsed[0], g: parsed[1], b: parsed[2], alpha };
}

export function relativeLuminance(color) {
    const linear = channel => channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    return 0.2126 * linear(color.r) + 0.7152 * linear(color.g) + 0.0722 * linear(color.b);
}

export function contrastRatio(foreground, background) {
    const foregroundLuminance = relativeLuminance(foreground);
    const backgroundLuminance = relativeLuminance(background);
    return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

export function requireTokens(tokens, names, mode) {
    for (const name of names) {
        if (!tokens[name])
            throw new Error(`Missing ${mode} token: ${name}`);
    }
}

export function colorToken(tokens, name, mode) {
    const value = tokens[name];
    if (!value)
        throw new Error(`Missing ${mode} token: ${name}`);

    const color = parseColor(value);
    if (!color)
        throw new Error(`Token ${name} in ${mode} mode is not a testable color: ${value}`);
    return color;
}

export function colorToHex(value) {
    const color = typeof value === "string" ? parseColor(value) : value;
    if (!color) return "#808080";
    const channel = x => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, "0");
    return `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`;
}

export function formatRatio(value) {
    return `${value.toFixed(2)}:1`;
}
