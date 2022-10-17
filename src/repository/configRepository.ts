import { emptyOrRows, getOffset } from "../helper";
import { AppDataSource } from "../data-source";
import { Configuration } from "../entity/configuration";

const configRepository = AppDataSource.getRepository(Configuration);


export async function createOrUpdateConfig(config: Configuration) {
    return await configRepository.save(config);
}

export async function getOneByID(id: number) {
    const rows = await configRepository.findOneBy({
        id_conf: id
    })
    const data = emptyOrRows(rows);
    return data;
}

export async function getAll() {
    const rows = await configRepository.find();
    return emptyOrRows(rows);
}
