import { Entity, Column, PrimaryColumn } from 'typeorm';

export type ResourceActions = Array<{
  resourceId : string,
  actions : Array<{
    name : string,
    permission : boolean
  }>
}>;


@Entity()
export default class Role {
  constructor(id: string, name: string, resource_actions : ResourceActions) {
    this.id = id;
    this.name = name;
    this.resource_actions = resource_actions;
  }

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  resource_actions: ResourceActions;
}
