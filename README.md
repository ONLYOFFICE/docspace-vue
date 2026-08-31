# @onlyoffice/docspace-vue

This repo contains the ONLYOFFICE Docspace Vue component which integrates [ONLYOFFICE DocSpace](https://github.com/ONLYOFFICE/DocSpace) into [Vue](https://vuejs.org/) projects.

**Please note**: To work with this component, you need to have ONLYOFFICE DocSpace. If you are new to DocSpace, [create an account](https://www.onlyoffice.com/docspace-registration.aspx).

## Prerequisites

This procedure requires [Node.js (and npm)](https://nodejs.org/en).

The component is built for Vue 3 and requires *vue* and *@onlyoffice/docspace-sdk-js* 2.x as peer dependencies.

## Creating the demo Vue application with ONLYOFFICE DocSpace

This procedure creates a basic Vue application and installs an ONLYOFFICE Docs editor in it.

1. Create a new Vue project named *docspace-vue-demo* using the *create-vue* package:
    ```
    npm create vue@latest docspace-vue-demo
    ```

2. Go to the newly created directory and install its dependencies:
    ```
    cd docspace-vue-demo
    npm install
    ```

3. Install ONLYOFFICE DocSpace Vue component from **npm** and save it to the *package.json* file with *--save*:
    ```
    npm install --save @onlyoffice/docspace-vue @onlyoffice/docspace-sdk-js
    ```

    *@onlyoffice/docspace-sdk-js* is a peer dependency of the component. npm 7 and later installs it automatically, other package managers may require the explicit installation shown above.

4. Open the *./src/App.vue* file in the *docspace-vue-demo* project and replace its contents with the following code:

    ```
    <script setup>
    import { DocSpace } from "@onlyoffice/docspace-vue";

    const onAppReady = function (e) {
        console.log("ONLYOFFICE DocSpace App is ready!");
    };

    const onAppError = (e) => {
        console.log(e);
    };

    const onSetDocspaceInstance = function (instance) {
        console.log(instance);
    };

    const config = {
        "src": "http://example-onlyoffice.com",
        "frameId": "onlyoffice-docspace",
        "mode": "manager",
        "width": "100%",
        "height": "100%",
        "events": {
            "onAppReady": onAppReady,
            "onAppError": onAppError
        }
    };
    </script>

    <template>
        <DocSpace
            :config="config"
            @set-docspace-instance="onSetDocspaceInstance"
        />
    </template>
    ```
    Replace the following lines with your own data:
    * **"http://example-onlyoffice.com"** - replace with the address of your ONLYOFFICE DocSpace, specified without a trailing slash;

    This Vue single-file component will create the *App* component containing the ONLYOFFICE DocSpace configured with basic features.

5. Test the application using the Node.js development server:
    * To start the development server, navigate to the *docspace-vue-demo* directory and run:
    ```
    npm run dev
    ```
    * To stop the development server, select on the command line or command prompt and press *Ctrl+C*.

## Deploying the demo Vue application

The easiest way to deploy the application to a production environment is to install [serve](https://github.com/vercel/serve) and create a static server:
1. Install the *serve* package globally:
    ```
    npm install -g serve
    ```

2. Serve your static site on the 3000 port:
    ```
    serve -s dist
    ```
    Another port can be adjusted using the *-l* or *--listen* flags:
    ```
    serve -s dist -l 4000
    ```

3. To serve the project folder, go to it and run the *serve* command:
    ```
    cd docspace-vue-demo
    serve
    ```

Now you can deploy the application to the created server:
1. Navigate to the *docspace-vue-demo* directory and run:
    ```
    npm run build
    ```
    The *dist* directory will be created with a production build of your app.

2. Copy the contents of the *docspace-vue-demo/dist* directory to the root directory of the web server (to the *docspace-vue-demo* folder).

    The application will be deployed on the web server (*http://localhost:3000* by default).

## API
### Props
| Name | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `config` | object | null | yes | Generic configuration object for opening a file with token. Requires `src` - the address of ONLYOFFICE DocSpace, specified without a trailing slash. [Config API](https://api.onlyoffice.com/docspace/jssdk/config/) |

### Events
| Name | Payload | Description |
| ------------- | ------------- | ------------- |
| `set-docspace-instance` | `instance: SDKInstance` | Emitted when DocSpace instance is obtained. The instance provides API methods for working with DocSpace. |

### Notes

* The `config` prop is applied when the component is mounted. To change the configuration of the already opened DocSpace, use the `setConfig` method of the instance obtained via the `set-docspace-instance` event, so that the frame is not recreated.
* The component renders a wrapper element around the DocSpace frame. Its width and height are taken from `config.width` and `config.height` (*100%* by default), which keeps the percentage sizes of the frame working.

## Storybook

Copy *.env.example* to *.env* and set the DocSpace the stories point at:
```
VITE_DOCSPACE_URL=https://example-onlyoffice.com
VITE_DOCSPACE_FILE_ID=100000
```
Only the *VITE_*-prefixed variables reach the browser. *VITE_DOCSPACE_FILE_ID* is the file the *Editor* story opens, it can be any file id from the portal above.

### Build Storybook:
```
npm run build-storybook
```
### Start Storybook:
```
npm run storybook
```

## Development

### Clone project from the GitHub repository:
```
git clone https://github.com/ONLYOFFICE/docspace-vue
```
### Install the project dependencies:
```
npm install
```
### Lint the sources:
```
npm run lint
```
### Test the component:
```
npm run test
```
The tests can also be run in watch mode with `npm run test:watch`, and with a coverage report with `npm run test:coverage`.
### Build the project:
```
npm run build
```
The *dist* directory will be created with the ESM and CommonJS bundles and the type declarations.
### Create the package:
```
npm pack
```

## Feedback and support

In case you have any issues, questions, or suggestions for the ONLYOFFICE DocSpace Vue component, please refer to the [Issues](https://github.com/ONLYOFFICE/docspace-vue/issues) section.

Official project website: [www.onlyoffice.com](https://www.onlyoffice.com/). 

Support forum: [forum.onlyoffice.com](https://forum.onlyoffice.com/).
