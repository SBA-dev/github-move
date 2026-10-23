export interface RattachementsDuParent {
  estRattache(parent: string, profil: string): Promise<boolean>;
}
