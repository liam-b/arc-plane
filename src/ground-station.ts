import './radio'

console.log('hello ground-station!')

function state(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

}

class Plane {
  @state
  fly() {}

  @state
  land() {}
}
