import type { IMenuSDK, MenuProps } from '@wix/editor-elements-corvid-utils';
import {
  changePropsSDKFactory,
  composeSDKFactories,
  createAccessibilityPropSDKFactory,
  createElementPropsSDKFactory,
  menuItemsPropsSDKFactory,
  menuPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const menuAccessibilityPropSDKFactory =
  createAccessibilityPropSDKFactory({
    enableAriaLabel: true,
    enableAriaLabelledBy: true,
    enableAriaDescribedBy: true,
    enableAriaLive: true,
    enableRole: true,
    enableScreenReader: true,
    enableLang: true,
  });

export const sdk = composeSDKFactories<MenuProps, IMenuSDK>([
  elementPropsSDKFactory,
  changePropsSDKFactory,
  menuPropsSDKFactory,
  menuItemsPropsSDKFactory,
  menuAccessibilityPropSDKFactory,
]);
