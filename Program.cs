using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Starfinder.Shield;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Detecta se está rodando no GitHub Pages
var baseUri = builder.HostEnvironment.BaseAddress.Contains("github.io")
    ? "https://azumamagus.github.io/startfinder-shield/"
    : builder.HostEnvironment.BaseAddress;

// Registra o HttpClient com o endereço base correto
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(baseUri) });

await builder.Build().RunAsync();
