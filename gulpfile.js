var elixir = require('laravel-elixir');

elixir.config.assetsPath = 'assets';
elixir.config.publicPath = 'public';
elixir.config.appPath = '';
elixir.config.css.outputFolder = 'assets/css';
elixir.config.js.outputFolder = 'assets/js';

elixir(function(mix) {
    // Font Awesome fonts
    mix.copy('node_modules/font-awesome/fonts', elixir.config.publicPath + '/assets/fonts');

    // Copy our fonts
    mix.copy(elixir.config.assetsPath + '/fonts', elixir.config.publicPath + '/assets/fonts');

    // Our css
    mix.sass('app.scss');

    // Our scripts
    mix.browserify('scripts.js');
});
