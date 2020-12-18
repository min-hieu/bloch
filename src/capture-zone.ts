import {Object3D} from 'three';
import {IntersectionMap, ObjectMap, objectsToMap} from './utils';

export type UserEvent = {
  type: 'mousedown' | 'mouseup' | 'mousemove',
  x: number,
  y: number,
  deltaX?: number,
  deltaY?: number
};

type Callback = (event: UserEvent, intersects: IntersectionMap) => void;
type InteractionObject = {uuid: string} | Object3D;

export abstract class CaptureZone
{
  onDrag(callback: Callback) {
    this.dragCallback = callback;
  }
  abstract process(isActive:boolean, event: UserEvent, intersects: IntersectionMap): boolean;

  protected dragCallback: Callback;
}

export class DragCaptureZone extends CaptureZone
{
  constructor(objects: Object3D[]) {
    super();
    this.uuids = objectsToMap(objects);
  }

  process(isActive:boolean, event: UserEvent, intersects: IntersectionMap): boolean {
    if (!isActive && event.type === 'mousedown' && this.isTargeted(intersects)) {
      return true;
    } else if (isActive && event.type === 'mousemove') {
      this.dragCallback(event, intersects);
      return true;
    }
    return false;
  }

  private uuids: ObjectMap;

  private isTargeted(intersects: IntersectionMap): boolean {
    if (this.uuids['background'])
      return true;

    for (let uuid in this.uuids) {
      if (intersects[uuid]) {
        return true;
      }
    }
    return false;
  }
}