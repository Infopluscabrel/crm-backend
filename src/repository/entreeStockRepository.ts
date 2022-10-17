import { config } from "../config";
import { emptyOrRows, getOffset } from "../helper";
import { AppDataSource } from "../data-source";
import { EntreeStock } from "../entity/entreeStock";

const enStockRepository = AppDataSource.getRepository(EntreeStock);


export async function createOrUpdateentStock(enStock: EntreeStock) {
    return await enStockRepository.save(enStock);
}

export async function getOneESByID(id: number) {
    const rows = await enStockRepository.findOneBy({
        id_es: id
    })
    const data = emptyOrRows(rows);
    return data;
}

export async function getAllByUser(page: number, user_id: any) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await enStockRepository.find(
        {
            where: {
                proprietaire: {
                    id_user: user_id
                }
            },
            order: {
                created_at: "DESC"
            },
            skip: offset,
            take: config.listPerPage
        }
    )
    const data = emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta,
    };
}

/*export async function getAllByUserForStat(page: number, user_id: any) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await enStockRepository.createQueryBuilder("es")
    return {
    
    };
}*/
