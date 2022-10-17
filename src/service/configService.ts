import { Configuration } from "../entity/configuration";
import { createOrUpdateConfig, getAll, getOneByID } from "../repository/configRepository";

export async function addOrUpdateConfig(conf: Configuration) {
    return createOrUpdateConfig(conf);
}

export async function findOneConfig(id: number) {
    return getOneByID(id);
}

export async function findAllConfig() {
    return getAll();
}
