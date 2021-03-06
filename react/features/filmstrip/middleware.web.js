// @flow

import VideoLayout from '../../../modules/UI/videolayout/VideoLayout';
import { MiddlewareRegistry } from '../base/redux';
import { CLIENT_RESIZED } from '../base/responsive-ui';
import { SETTINGS_UPDATED } from '../base/settings';
import {
    getCurrentLayout,
    LAYOUTS
} from '../video-layout';

import { setHorizontalViewDimensions, setTileViewDimensions, setVerticalViewDimensions } from './actions.web';

import './subscriber.web';

/**
 * The middleware of the feature Filmstrip.
 */
MiddlewareRegistry.register(store => next => action => {
    const result = next(action);

    switch (action.type) {
    case CLIENT_RESIZED: {
        const state = store.getState();
        const layout = getCurrentLayout(state);

        switch (layout) {
        case LAYOUTS.TILE_VIEW: {
            const { gridDimensions } = state['features/filmstrip'].tileViewDimensions;

            store.dispatch(setTileViewDimensions(gridDimensions));
            break;
        }
        case LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW:
            store.dispatch(setHorizontalViewDimensions());
            break;

        case LAYOUTS.VERTICAL_FILMSTRIP_VIEW:
            store.dispatch(setVerticalViewDimensions());
            break;
        }
        break;
    }
    case SETTINGS_UPDATED: {
        if (typeof action.settings?.localFlipX === 'boolean') {
            // TODO: This needs to be removed once the large video is Reactified.
            VideoLayout.onLocalFlipXChanged();
        }
        break;
    }
    }

    return result;
});

