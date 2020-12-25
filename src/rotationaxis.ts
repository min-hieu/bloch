import {makeArc, makeArrow} from './utils';
import {ArrowHelper, AxesHelper, Geometry, Object3D, PointsMaterial, Points, Vector3, Line, Vector2} from 'three';
import { acos, complex } from 'mathjs';

export class RotationAxis
{
  private arc: Line;
  private direction: Vector3;
  private dot: Points;
  private parent: Object3D;
  private arrowHelper: ArrowHelper;
  private rotationAngle: number;

  constructor(p: Object3D) {
    this.parent = p;
    this.arrowHelper = makeArrow(1, 0, 0, 0xff0000);
    this.parent.add(this.arrowHelper);

    const dotGeometry = new Geometry();
    dotGeometry.vertices.push(new Vector3(0, 0, 0));
    const dotMaterial = new PointsMaterial( { size: 10, sizeAttenuation: false } );
    this.dot = new Points( dotGeometry, dotMaterial );
    this.parent.add(this.dot);
  }

  setDirection(dir: Vector3, angle: number) {
    this.direction = dir;
    this.arrowHelper.setDirection(this.direction);
    this.rotationAngle = angle;
  }

  setArc(quantumStatePoint: Vector3) {
    const cosineAngle = quantumStatePoint.dot(this.direction);
    const closestPointOnLine = this.direction.clone().multiplyScalar(cosineAngle);
    const closestPointOnLineCoords: [number, number, number] = [closestPointOnLine.x, closestPointOnLine.y, closestPointOnLine.z];
    this.dot.position.set(...closestPointOnLineCoords);

    if (this.arc)
      this.parent.remove(this.arc);

    const distance = quantumStatePoint.clone().sub(closestPointOnLine).length();
    this.arc = makeArc(this.rotationAngle, distance);
    this.parent.add(this.arc);

    this.arc.position.set(...closestPointOnLineCoords);
    this.arc.lookAt(this.arc.worldToLocal(this.parent.localToWorld(this.direction.clone())));
    this.arc.updateWorldMatrix(true, true);

    const localQuantumStatePoint = this.arc.worldToLocal(this.parent.localToWorld(quantumStatePoint.clone()));
    const projectedQuantumStatePoint = new Vector2(localQuantumStatePoint.x, localQuantumStatePoint.y).normalize();
    const angle = complex(projectedQuantumStatePoint.x, projectedQuantumStatePoint.y).toPolar().phi;
    this.arc.rotateZ(angle);
  }
}