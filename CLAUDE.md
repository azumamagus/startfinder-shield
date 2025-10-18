# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Starfinder Shield is a Blazor WebAssembly (WASM) application serving as a reference tool for the Starfinder RPG. It provides game masters and players with quick access to game conditions, equipment stats (weapons), and other reference materials. The app is designed with a futuristic/sci-fi theme and is deployed to GitHub Pages.

## Technology Stack

- **Framework**: Blazor WebAssembly (.NET 9.0)
- **Deployment**: GitHub Pages via GitHub Actions
- **Styling**: Bootstrap 5.3.3 + Custom CSS (futuristic theme)
- **Icons**: Bootstrap Icons
- **Fonts**: Google Fonts (Orbitron)

## Build and Development Commands

### Local Development
```bash
# Restore dependencies
dotnet restore

# Run development server (typically listens on https://localhost:5001 and http://localhost:5000)
dotnet run

# Watch mode for development (auto-rebuild on file changes)
dotnet watch
```

### Building and Publishing
```bash
# Build in Release configuration
dotnet build -c Release

# Publish for production deployment
dotnet publish -c Release -o docs

# Publish specifically for GitHub Pages (as used in CI/CD)
dotnet publish Starfinder.Shield.csproj -c:Release -o docs --nologo
```

### Testing
Currently, no test projects exist in the solution. If adding tests, follow standard .NET testing patterns with xUnit or NUnit.

## Architecture

### GitHub Pages Deployment Strategy

The application handles GitHub Pages deployment with a dual-base-path approach:

1. **Program.cs** (lines 10-16): Detects if running on `github.io` and sets the base URI accordingly
2. **index.html** (line 9): Base href is commented out for GitHub Pages, set to `"/"` for local development
3. **404.html redirect handling** (index.html lines 40-45): Uses `sessionStorage.redirect` to handle client-side routing on GitHub Pages

When deploying to GitHub Pages, the base path is `https://azumamagus.github.io/startfinder-shield/`.

### Layout Structure

The application has two layout files (due to refactoring in progress):

- **Layout/MainLayout.razor**: Current active layout with futuristic navbar and sidebar
- **Shared/MainLayout.razor**: Alternative layout variant (appears to be an older or experimental version)

The active layout uses:
- Responsive sidebar that toggles on mobile vs desktop
- JavaScript-driven sidebar controls (wwwroot/js/site.js)
- Overlay for mobile sidebar backdrop
- Desktop/mobile toggle buttons

### Data Flow Pattern

All reference data is stored as JSON files in `wwwroot/` and loaded via HttpClient:

1. **Pages load JSON data** in `OnInitializedAsync()` lifecycle method
2. **HttpClient** is injected using `[Inject]` attribute
3. **JSON parsing** uses `System.Text.Json.JsonDocument` for manual deserialization
4. **Models** (e.g., `ArmaItem`) represent the structured data

Example pattern in ArmasBrancasBasicas.razor:
```csharp
var json = await Http.GetStringAsync("/armas-brancas-basicas.json");
var doc = JsonDocument.Parse(json);
// Manual enumeration and property extraction...
```

### Data Files

JSON reference files in `wwwroot/`:
- `condicoes.json`: Game conditions organized by category
- `armas-brancas-basicas.json`: Basic melee weapons
- `armas-brancas-avancadas.json`: Advanced melee weapons
- `armas-brancas-avancadas-2.json`: Additional advanced melee weapons

### JavaScript Interop

Two JavaScript files handle client-side functionality:

**site.js**: Sidebar toggle logic with:
- Desktop/mobile responsive behavior
- Event attachment with retry mechanism for Blazor rendering
- Overlay management
- Body scroll lock when sidebar is open

**resizeInterop.js**: Window resize detection for responsive UI
- Used by Condicoes.razor to toggle mobile/desktop views
- Exposes `registerResize`, `unregisterResize`, and `getWidth` to .NET via `IJSRuntime`

### Routing

Routes are defined using `@page` directive in Razor components:
- `/` - Home.razor (home page)
- `/condicoes` - Condicoes.razor (game conditions)
- `/equipamentos/armas-brancas-basicas` - Basic melee weapons
- `/equipamentos/armas-brancas-avancadas` - Advanced melee weapons
- `/equipamentos/armas-brancas-avancadas-2` - More advanced melee weapons

The NavMenu.razor component provides collapsible navigation with a submenu for Equipamentos (equipment) pages.

### Styling Architecture

CSS is split across multiple files:
- `wwwroot/css/app.css`: Global styles
- `wwwroot/css/layout-shell.css`: Layout-specific styles for the app shell
- `css/condicoes-futurista.css`: Page-specific styles for conditions page (futuristic theme)
- Component-specific styles in `.razor.css` files (scoped CSS)

Bootstrap 5.3.3 is used as the foundation, with custom theming for the sci-fi/futuristic aesthetic.

### Service Worker

The application is configured as a Progressive Web App (PWA):
- `service-worker.js`: Development service worker
- `service-worker.published.js`: Production service worker
- Registered in index.html (line 48)
- Assets manifest defined in .csproj (line 7)

## Common Workflows

### Adding New Equipment Pages

1. Create a new JSON file in `wwwroot/` with equipment data
2. Create a new Razor page in `Pages/Equipamentos/`
3. Use the existing weapon pages as templates (ArmasBrancasBasicas.razor)
4. Add route with `@page` directive
5. Add navigation link to NavMenu.razor in the Equipamentos submenu
6. Inject `HttpClient` and load JSON in `OnInitializedAsync()`

### Adding New Game Reference Categories

1. Add JSON data file to `wwwroot/`
2. Create a new page in `Pages/` (follow Condicoes.razor pattern if hierarchical data)
3. Create corresponding model classes in `Models/` if reusable
4. Add route and navigation link to NavMenu.razor

### Modifying the Layout

The active layout is `Layout/MainLayout.razor`. Key areas:
- **Sidebar**: NavMenu.razor component
- **Header/Navbar**: Lines 11-34 in MainLayout.razor
- **JavaScript interaction**: Ensure `site.js` event bindings match element IDs
- **Responsive behavior**: Uses Bootstrap breakpoints (`d-lg-none`, `d-md-inline`, etc.)

### Deployment

Deployment is fully automated via GitHub Actions:
- Workflow file: `.github/workflows/main`
- Triggers on push to `main` branch or manual workflow dispatch
- Installs .NET 9.0 and WASM tools
- Publishes to `docs/wwwroot` directory
- Deploys to GitHub Pages

To deploy manually, push to `main` branch or trigger the workflow from GitHub Actions UI.

## Important Notes

- **No tests currently exist** in the project - consider adding test coverage if making significant changes
- **Two MainLayout files exist** - Layout/MainLayout.razor is the active one
- **Base href switching** for GitHub Pages is handled in Program.cs - be careful when modifying HttpClient configuration
- **Manual JSON deserialization** is used throughout - consider using `JsonSerializer.Deserialize<T>()` for new code
- **Error handling** in data loading is minimal (empty catch blocks) - consider improving error reporting for new features
- **The branch `melhorias`** has uncommitted changes to layout and styling files - these are works in progress
