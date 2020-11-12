import publishDateFilter from './PublishDateFilter';
/* eslint-disable */
const apply = jest.fn();
const currentFilter = { public_date: 'filter' };

describe('PublishDateFitler', () => {
    it('Should set currentValue to zero and init', () => {
        const response = publishDateFilter(apply);
        expect(response.filterValues.value).toEqual(undefined);
        expect(response.label).toEqual('Publish date');
        expect(response.type).toEqual('radio');
    });

    it('Should call apply with a date', () => {
        const response = publishDateFilter(apply, currentFilter);
        response.filterValues.onChange('event', 'testValue');
        expect(apply).toHaveBeenCalledWith({ filter: { public_date: 'testValue' } });
    });

    it('Should call apply with empty string ', () => {
        const response = publishDateFilter(apply);
        response.filterValues.onChange();
        expect(apply).toHaveBeenCalledWith({ filter: { public_date: '' } });
    });
});
/* eslint-enable */
