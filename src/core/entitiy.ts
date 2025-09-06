import { UniqueEntityId } from './unique-entity-id';

class Entity<Props> {
  private _id: UniqueEntityId;
  private _props: Props;
  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this._props = props;
  }

  get id() {
    return this._id;
  }
  protected get props(): Props {
    return this._props;
  }

  public equals(entity: Entity<any>): boolean {
    if (entity === this) return true;

    if (entity._id === this._id) return true;

    return false;
  }
}
export { Entity };
