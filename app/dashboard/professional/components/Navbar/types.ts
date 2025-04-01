import { ComponentType } from 'react';
import { SVGProps } from 'react';

export interface NavItem {
  id: string;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}