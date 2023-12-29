import React from 'react';
import { Range } from 'slate';

import { CursorOverlayProps } from '../components';
import { SelectionRect } from '../types';
import { useRequestReRender } from './useRequestReRender';

export interface useRefreshOnResizeOptions
  extends Pick<CursorOverlayProps, 'refreshOnResize' | 'containerRef'> {
  selectionRectCache: React.MutableRefObject<WeakMap<Range, SelectionRect[]>>;
}

export const useRefreshOnResize = ({
  containerRef,
  refreshOnResize,
  selectionRectCache,
}: useRefreshOnResizeOptions) => {
  const requestReRender = useRequestReRender();

  // Reset the selection rect cache and request re-render.
  const refresh = React.useCallback(
    (sync = false) => {
      selectionRectCache.current = new WeakMap();
      requestReRender(sync);
    },
    [requestReRender, selectionRectCache]
  );

  // Refresh on container resize
  React.useEffect(() => {
    if (!refreshOnResize || !containerRef?.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => refresh());
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [containerRef, refresh, refreshOnResize]);

  return {
    refresh,
  };
};
