const withSass = require("@zeit/next-sass");
// module.exports = withSass()

module.exports = withSass({
    webpack: (config, props) => {
        // Perform customizations to webpack config
        // Important: return the modified config
        const alias = {
            components: props.dir + "/components",
            src: props.dir + "/src",
            lib: props.dir + "/lib",
            hocs: props.dir + "/hocs",
            appRedux: props.dir + "/redux",
            styles: props.dir + "/styles",
            services: props.dir + "/services",
            static: props.dir + "/static",
            helpers: props.dir + "/helpers"
        };
        config.resolve.alias = { ...config.resolve.alias, ...alias };
        return config;
    },
    webpackDevMiddleware: config => {
        // Perform customizations to webpack dev middleware config
        // Important: return the modified config
        return config;
    }
});
