import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';

export const mountWithRouter = (Component) => {
    return render(<BrowserRouter>{Component}</BrowserRouter>);
};

export const mountWithRouterAndProvider = (Component, store) => {
    return render(
        <Provider store={store}>
            <BrowserRouter>{Component}</BrowserRouter>
        </Provider>
    );
};

export const mountWithRouterAndProviderAndIntl = (Component, store) => {
    return render(
        <IntlProvider>
            <Provider store={store}>
                <BrowserRouter>{Component}</BrowserRouter>
            </Provider>
        </IntlProvider>
    );
};
