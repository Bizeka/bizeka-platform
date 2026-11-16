# Bizeka.Extensions

Reusable editors, formatters, and JSON data components for Serenity 10.6.3 modules.

The NuGet package is `Bizeka.Extensions`; the npm package is `@bizeka/extensions`. Both are versioned before publication and are not published from local builds.

TR: Bu modül özel ön sürümdür. Kurulum ve yayın koşulları için kök README ve release kontrol listesini izleyin.

## Grid filter toggle

`addGridFilterToggle(gridElement, text?)` adds a **Filters** button to a Serenity grid's toolbar. At 480 px and below, the quick filter bar starts collapsed and the button opens and closes it; above that width the button is hidden and the bar stays visible. The button uses Serenity's `tool-button` class, so it matches the other toolbar buttons.

```ts
import { addGridFilterToggle } from "@bizeka/extensions";

const grid = new TaskItemGrid({ element: el => samplePanel().append(el) });
layoutGrid(grid);
addGridFilterToggle(grid.domNode);
```

Call it once after the grid is laid out. It works for any Serenity grid that has a quick filter bar (`.quick-filters-bar`). The Bizeka Samples page **Todo / Task Visibility** shows it in use.

TR: `addGridFilterToggle(gridElement, text?)` bir Serenity grid'in araç çubuğuna **Filters** (Filtreler) düğmesi ekler. 480 px ve altında hızlı filtre çubuğu kapalı başlar, düğme onu açıp kapatır; daha geniş ekranlarda düğme gizlenir ve çubuk görünür kalır. Düğme Serenity'nin `tool-button` sınıfını kullanır, bu yüzden araç çubuğundaki diğer düğmelerle aynı görünür. Grid oluşturulup yerleştirildikten sonra bir kez çağrılır. Örnek kullanım için Bizeka Samples içindeki **Todo / Task Visibility** sayfasına bakın.
