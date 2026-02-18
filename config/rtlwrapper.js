import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

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
