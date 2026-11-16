import { Formatter, formatterTypeInfo, registerType, resolveUrl, endsWith } from "@serenity-is/corelib";
import { FormatterContext, FormatterResult } from "@serenity-is/sleekgrid";

export class MultipleFileDownloadFormatter implements Formatter {
    static [Symbol.typeInfo] = formatterTypeInfo("Bizeka.Extensions.MultipleFileDownloadFormatter"); static { registerType(this); }

    constructor(public readonly props: { showFileNames?: boolean } = {}) {
        this.props ??= {};
    }

    format(ctx: FormatterContext): FormatterResult {
        if (!ctx || !ctx.value) {
            return "";
        }

        let files: any[];
        try {
            files = typeof ctx.value === "string" ? JSON.parse(ctx.value) : ctx.value;
        } catch {
            return "";
        }

        if (!Array.isArray(files)) {
            return "";
        }

        return (
            <>
                {files.map(file => {
                    if (!file) return null;
                    let fileDownloadName = this.props?.showFileNames ? file.OriginalName : "";
                    let downloadUrl = resolveUrl("~/upload/" + (file.Filename || ""));
                    let originalName = (file.OriginalName || "").toLowerCase();

                    let backgroundStyle = "";
                    if (endsWith(originalName, ".doc") || endsWith(originalName, ".docx")) {
                        backgroundStyle = "url(/Content/serenity/images/docx.png) no-repeat left 1px";
                    } else if (endsWith(originalName, ".xls") || endsWith(originalName, ".xlsx")) {
                        backgroundStyle = "url(/Content/serenity/images/xlsx.png) no-repeat left 1px";
                    } else if (endsWith(originalName, ".pdf")) {
                        backgroundStyle = "url(/Content/serenity/images/pdf.png) no-repeat left 1px";
                    } else if (endsWith(originalName, ".png") || endsWith(originalName, ".jpg") || endsWith(originalName, ".jpeg")) {
                        backgroundStyle = "url(/Content/serenity/images/jpg.png) no-repeat left 1px";
                    } else if (endsWith(originalName, ".pptx") || endsWith(originalName, ".ppsx") || endsWith(originalName, ".ppt")) {
                        backgroundStyle = "url(/Content/serenity/images/projection-screen-presentation.png) no-repeat left 1px";
                    }

                    return (
                        <a 
                            style={{ background: backgroundStyle, marginTop: "7px" }} 
                            class="file-download-link" 
                            target="_blank" 
                            title={file.OriginalName || ""} 
                            href={downloadUrl}>
                            {fileDownloadName}
                        </a>
                    );
                })}
            </>
        );
    }

    get showFileNames() { return this.props?.showFileNames; }
    set showFileNames(value) { if (this.props) this.props.showFileNames = value; }
}
