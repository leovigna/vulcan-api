import { withFilter } from 'apollo-server'

import { nexusPrismaPlugin } from 'nexus-prisma'
import { idArg, makeSchema, objectType, interfaceType, stringArg, subscriptionField, intArg } from 'nexus'
import { transformSchemaFederation } from 'graphql-transform-federation';
import { delegateToSchema } from 'graphql-tools';


if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}


const NodeOperator = objectType({
    name: 'NodeOperator',
    definition(t) {
        Object.values(t.model).map((field: any) => { field() })
    }
})

//Extend the Chainlink Object
const JobSpec = objectType({
    name: 'JobSpec',
    definition(t) {
        Object.values(t.model).map((field: any) => { field() })
    }
})

const ContractDefinition = objectType({
    name: 'ContractDefinition',
    definition(t) {
        Object.values(t.model).map((field: any) => { field() })
    }
})

const Contract = objectType({
    name: 'Contract',
    definition(t) {
        Object.values(t.model).map((field: any) => { field() })
    }
})

const Event = objectType({
    name: 'Event',
    definition(t) {
        Object.values(t.model).map((field: any) => { field() })
    }
})

const OracleAggregator = objectType({
    name: 'OracleAggregator',
    definition(t) {
        Object.values(t.model).map((field: any) => { field() })
    }
})

const DiscordChannel = objectType({
    name: 'DiscordChannel',
    definition(t) {
        Object.values(t.model).map((field: any) => { field() })
    }
})

const Query = objectType({
    name: 'Query',
    definition(t) {
        t.crud.nodeOperator();
        t.crud.nodeOperators();
        t.crud.contract();
        t.crud.contracts();
        t.crud.contractDefinition();
        t.crud.contractDefinitions();
        t.crud.event();
        t.crud.events();
        t.crud.oracleAggregator();
        t.crud.oracleAggregators();
        t.crud.discordChannel();
        t.crud.discordChannels();
        //t.crud.jobSpec();
        //t.crud.jobSpecs();
    },
})

const ContractSubscription = subscriptionField('ContractSubscription', {
    type: 'Event',
    args: {
        address: stringArg(),
        event: stringArg(),
    },
    description: 'Subscribe to Contract Events.',
    subscribe: withFilter(
        (_, args, { pubsub, prisma }) => pubsub.asyncIterator("CONTRACT_EVENT"),
        async (payload, { address, event }, { pubsub, prisma }) => { //_, args, context
            return (!address || payload.address === address) &&
                (!event || payload.event === event);
        }),
    resolve: async (payload, args, { pubsub, prisma }) => {
        console.debug(args)
        console.debug(payload)

        const returnValues = JSON.stringify(payload.returnValues)
        return { ...payload, returnValues }
    }
})


const Mutation = objectType({
    name: 'Mutation',
    definition(t) {
        t.crud.createOneDiscordChannel();
        t.crud.updateOneDiscordChannel();
        t.crud.updateManyDiscordChannel();
        t.crud.deleteOneDiscordChannel();
        t.crud.deleteManyDiscordChannel();
        t.crud.upsertOneDiscordChannel();
    },
})

const types = [
    Query,
    Mutation,
    NodeOperator,
    ContractDefinition,
    Contract,
    Event,
    OracleAggregator,
    DiscordChannel,
    JobSpec
]
//ContractSubscription

const schema = makeSchema({
    types,
    plugins: [nexusPrismaPlugin({
        outputs: {
            typegen: __dirname + '/generated/nexus-prisma.ts',
        }
    })],
    outputs: {
        schema: __dirname + '/../schema.graphql',
        typegen: __dirname + '/generated/nexus.ts',
    },
    typegenAutoConfig: {
        contextType: 'Context.Context',
        sources: [
            {
                source: '@prisma/client',//require.resolve('./generated/client'),
                alias: 'prisma',
            },
            {
                source: require.resolve('./context'),
                alias: 'Context',
            }
        ],
    },
})

const federatedSchema = transformSchemaFederation(schema, {
    Query: {
        extend: true,
    },
    JobSpec: {
        extend: true,
        keyFields: ['id'],
        fields: {
            id: {
                external: true
            }
        },
        //@ts-ignore
        async resolveReference({ id }: any, { prisma }, info) {
            return await prisma.jobSpec.findOne({ where: { id } })
        }
    },
    NodeOperator: {
        keyFields: ['id'],
        resolveReference({ id }: any, context, info) {
            console.debug(`Find NodeOperator ${id}`);
            return delegateToSchema({
                schema: info.schema,
                operation: 'query',
                fieldName: 'NodeOperatorWhereUniqueInput',
                args: {
                    where: { id },
                },
                //@ts-ignore
                context,
                info,
            });
        },
    },
})

export default federatedSchema;
