/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/iswap.json`.
 */
export type Iswap = {
    address: 'dXgZyuguvD2m5G5385XkdokZBryUoSE6LbNJeWiFiN5';
    metadata: {
        name: 'iswap';
        version: '0.1.0';
        spec: '0.1.0';
        description: 'Created with Anchor';
    };
    instructions: [
        {
            name: 'close';
            discriminator: [98, 165, 201, 177, 108, 65, 206, 96];
            accounts: [
                {
                    name: 'payer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'iswap';
                    writable: true;
                },
            ];
            args: [];
        },
        {
            name: 'createUserModelConfig';
            discriminator: [223, 134, 42, 71, 88, 218, 233, 3];
            accounts: [
                {
                    name: 'userModelConfig';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [
                                    85,
                                    115,
                                    101,
                                    114,
                                    77,
                                    111,
                                    100,
                                    101,
                                    108,
                                    67,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103,
                                    95,
                                    118,
                                    49,
                                ];
                            },
                            {
                                kind: 'account';
                                path: 'creator';
                            },
                        ];
                    };
                },
                {
                    name: 'creator';
                    writable: true;
                    signer: true;
                    address: '3Mxb3vnmPRcf8UCYSVaUrCc5VKV1P33EjMGuaJMuah4q';
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
            ];
            args: [
                {
                    name: 'etfCreatePointsReward';
                    type: 'u64';
                },
                {
                    name: 'kisuneLevelNeeded';
                    type: 'u64';
                },
                {
                    name: 'ryuLevelNeeded';
                    type: 'u64';
                },
                {
                    name: 'toraLevelNeeded';
                    type: 'u64';
                },
                {
                    name: 'oniLevelNeeded';
                    type: 'u64';
                },
                {
                    name: 'kamiLevelNeeded';
                    type: 'u64';
                },
            ];
        },
        {
            name: 'decrement';
            discriminator: [106, 227, 168, 59, 248, 27, 150, 101];
            accounts: [
                {
                    name: 'iswap';
                    writable: true;
                },
            ];
            args: [];
        },
        {
            name: 'etfBurn';
            discriminator: [185, 203, 114, 195, 129, 70, 235, 23];
            accounts: [
                {
                    name: 'etfTokenInfo';
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [
                                    101,
                                    116,
                                    102,
                                    95,
                                    116,
                                    111,
                                    107,
                                    101,
                                    110,
                                    95,
                                    118,
                                    51,
                                ];
                            },
                            {
                                kind: 'account';
                                path: 'etfTokenMintAccount';
                            },
                        ];
                    };
                },
                {
                    name: 'etfTokenMintAccount';
                    writable: true;
                },
                {
                    name: 'etfTokenAta';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'account';
                                path: 'authority';
                            },
                            {
                                kind: 'const';
                                value: [
                                    6,
                                    221,
                                    246,
                                    225,
                                    215,
                                    101,
                                    161,
                                    147,
                                    217,
                                    203,
                                    225,
                                    70,
                                    206,
                                    235,
                                    121,
                                    172,
                                    28,
                                    180,
                                    133,
                                    237,
                                    95,
                                    91,
                                    55,
                                    145,
                                    58,
                                    140,
                                    245,
                                    133,
                                    126,
                                    255,
                                    0,
                                    169,
                                ];
                            },
                            {
                                kind: 'account';
                                path: 'etfTokenMintAccount';
                            },
                        ];
                        program: {
                            kind: 'const';
                            value: [
                                140,
                                151,
                                37,
                                143,
                                78,
                                36,
                                137,
                                241,
                                187,
                                61,
                                16,
                                41,
                                20,
                                142,
                                13,
                                131,
                                11,
                                90,
                                19,
                                153,
                                218,
                                255,
                                16,
                                132,
                                4,
                                142,
                                123,
                                216,
                                219,
                                233,
                                248,
                                89,
                            ];
                        };
                    };
                },
                {
                    name: 'authority';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                    address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
            ];
            args: [
                {
                    name: 'lamports';
                    type: 'f64';
                },
            ];
        },
        {
            name: 'etfCreate';
            discriminator: [0, 81, 62, 85, 242, 37, 4, 245];
            accounts: [
                {
                    name: 'etfTokenInfo';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [
                                    101,
                                    116,
                                    102,
                                    95,
                                    116,
                                    111,
                                    107,
                                    101,
                                    110,
                                    95,
                                    118,
                                    51,
                                ];
                            },
                            {
                                kind: 'account';
                                path: 'etfTokenMintAccount';
                            },
                        ];
                    };
                },
                {
                    name: 'metadataAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [109, 101, 116, 97, 100, 97, 116, 97];
                            },
                            {
                                kind: 'account';
                                path: 'tokenMetadataProgram';
                            },
                            {
                                kind: 'account';
                                path: 'etfTokenMintAccount';
                            },
                        ];
                        program: {
                            kind: 'account';
                            path: 'tokenMetadataProgram';
                        };
                    };
                },
                {
                    name: 'etfTokenMintAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [
                                    101,
                                    116,
                                    102,
                                    95,
                                    116,
                                    111,
                                    107,
                                    101,
                                    110,
                                    95,
                                    118,
                                    51,
                                ];
                            },
                            {
                                kind: 'arg';
                                path: 'args.symbol';
                            },
                        ];
                    };
                },
                {
                    name: 'rent';
                    address: 'SysvarRent111111111111111111111111111111111';
                },
                {
                    name: 'authority';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'tokenMetadataProgram';
                    address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
                },
                {
                    name: 'tokenProgram';
                    address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
            ];
            args: [
                {
                    name: 'args';
                    type: {
                        defined: {
                            name: 'etfTokenArgs';
                        };
                    };
                },
            ];
        },
        {
            name: 'etfMint';
            discriminator: [253, 102, 37, 173, 154, 46, 245, 224];
            accounts: [
                {
                    name: 'etfTokenInfo';
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [
                                    101,
                                    116,
                                    102,
                                    95,
                                    116,
                                    111,
                                    107,
                                    101,
                                    110,
                                    95,
                                    118,
                                    51,
                                ];
                            },
                            {
                                kind: 'account';
                                path: 'etfTokenMintAccount';
                            },
                        ];
                    };
                },
                {
                    name: 'etfTokenMintAccount';
                    writable: true;
                },
                {
                    name: 'etfTokenAta';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'account';
                                path: 'authority';
                            },
                            {
                                kind: 'const';
                                value: [
                                    6,
                                    221,
                                    246,
                                    225,
                                    215,
                                    101,
                                    161,
                                    147,
                                    217,
                                    203,
                                    225,
                                    70,
                                    206,
                                    235,
                                    121,
                                    172,
                                    28,
                                    180,
                                    133,
                                    237,
                                    95,
                                    91,
                                    55,
                                    145,
                                    58,
                                    140,
                                    245,
                                    133,
                                    126,
                                    255,
                                    0,
                                    169,
                                ];
                            },
                            {
                                kind: 'account';
                                path: 'etfTokenMintAccount';
                            },
                        ];
                        program: {
                            kind: 'const';
                            value: [
                                140,
                                151,
                                37,
                                143,
                                78,
                                36,
                                137,
                                241,
                                187,
                                61,
                                16,
                                41,
                                20,
                                142,
                                13,
                                131,
                                11,
                                90,
                                19,
                                153,
                                218,
                                255,
                                16,
                                132,
                                4,
                                142,
                                123,
                                216,
                                219,
                                233,
                                248,
                                89,
                            ];
                        };
                    };
                },
                {
                    name: 'authority';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'tokenProgram';
                },
                {
                    name: 'associatedTokenProgram';
                    address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
            ];
            args: [
                {
                    name: 'lamports';
                    type: 'f64';
                },
            ];
        },
        {
            name: 'increment';
            discriminator: [11, 18, 104, 9, 104, 174, 59, 33];
            accounts: [
                {
                    name: 'iswap';
                    writable: true;
                },
            ];
            args: [];
        },
        {
            name: 'initialize';
            discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
            accounts: [
                {
                    name: 'payer';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'iswap';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
            ];
            args: [];
        },
        {
            name: 'initializeUser';
            discriminator: [111, 17, 185, 250, 60, 122, 38, 254];
            accounts: [
                {
                    name: 'userAccount';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [
                                    117,
                                    115,
                                    101,
                                    114,
                                    65,
                                    99,
                                    99,
                                    111,
                                    117,
                                    110,
                                    116,
                                    95,
                                    118,
                                    50,
                                ];
                            },
                            {
                                kind: 'account';
                                path: 'user';
                            },
                        ];
                    };
                },
                {
                    name: 'inviterAccount';
                    optional: true;
                },
                {
                    name: 'user';
                    writable: true;
                    signer: true;
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
            ];
            args: [
                {
                    name: 'nickname';
                    type: 'string';
                },
                {
                    name: 'directInviter';
                    type: {
                        option: 'pubkey';
                    };
                },
                {
                    name: 'avatar';
                    type: 'string';
                },
            ];
        },
        {
            name: 'set';
            discriminator: [198, 51, 53, 241, 116, 29, 126, 194];
            accounts: [
                {
                    name: 'iswap';
                    writable: true;
                },
            ];
            args: [
                {
                    name: 'value';
                    type: 'u8';
                },
            ];
        },
        {
            name: 'updateUserModelConfig';
            discriminator: [116, 238, 2, 64, 205, 220, 83, 26];
            accounts: [
                {
                    name: 'userModelConfig';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [
                                    85,
                                    115,
                                    101,
                                    114,
                                    77,
                                    111,
                                    100,
                                    101,
                                    108,
                                    67,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103,
                                    95,
                                    118,
                                    49,
                                ];
                            },
                            {
                                kind: 'account';
                                path: 'authority';
                            },
                        ];
                    };
                },
                {
                    name: 'authority';
                    signer: true;
                    address: '3Mxb3vnmPRcf8UCYSVaUrCc5VKV1P33EjMGuaJMuah4q';
                },
                {
                    name: 'systemProgram';
                    address: '11111111111111111111111111111111';
                },
            ];
            args: [
                {
                    name: 'num';
                    type: 'u8';
                },
                {
                    name: 'value';
                    type: 'u64';
                },
            ];
        },
    ];
    accounts: [
        {
            name: 'etfToken';
            discriminator: [187, 90, 26, 73, 137, 112, 105, 60];
        },
        {
            name: 'iswap';
            discriminator: [228, 5, 227, 43, 35, 87, 170, 87];
        },
        {
            name: 'userAccount';
            discriminator: [211, 33, 136, 16, 186, 110, 242, 127];
        },
        {
            name: 'userModelConfig';
            discriminator: [147, 139, 68, 91, 207, 211, 77, 153];
        },
    ];
    events: [
        {
            name: 'addPointsRewardEvent';
            discriminator: [6, 206, 78, 233, 9, 245, 21, 208];
        },
        {
            name: 'etfTokenBurnEvent';
            discriminator: [86, 32, 4, 35, 170, 93, 29, 251];
        },
        {
            name: 'etfTokenCreateEvent';
            discriminator: [166, 238, 215, 49, 221, 120, 90, 191];
        },
        {
            name: 'etfTokenMintEvent';
            discriminator: [55, 168, 3, 194, 101, 86, 242, 173];
        },
        {
            name: 'userInitialized';
            discriminator: [66, 195, 5, 223, 42, 84, 135, 60];
        },
    ];
    errors: [
        {
            code: 6000;
            name: 'invalidAccounts';
            msg: 'Lack of necessary accounts';
        },
        {
            code: 6001;
            name: 'insufficientBalance';
            msg: 'Insufficient balance';
        },
    ];
    types: [
        {
            name: 'addPointsRewardEvent';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'amount';
                        type: 'u64';
                    },
                    {
                        name: 'rewardType';
                        type: {
                            defined: {
                                name: 'pointsRewardType';
                            };
                        };
                    },
                    {
                        name: 'userPointsAccount';
                        type: 'pubkey';
                    },
                    {
                        name: 'createdAt';
                        type: 'i64';
                    },
                ];
            };
        },
        {
            name: 'etfAsset';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'token';
                        type: 'pubkey';
                    },
                    {
                        name: 'weight';
                        type: 'u16';
                    },
                ];
            };
        },
        {
            name: 'etfToken';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'mintAccount';
                        type: 'pubkey';
                    },
                    {
                        name: 'creator';
                        type: 'pubkey';
                    },
                    {
                        name: 'createAt';
                        type: 'i64';
                    },
                    {
                        name: 'description';
                        type: 'string';
                    },
                    {
                        name: 'assets';
                        type: {
                            vec: {
                                defined: {
                                    name: 'etfAsset';
                                };
                            };
                        };
                    },
                ];
            };
        },
        {
            name: 'etfTokenArgs';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'name';
                        type: 'string';
                    },
                    {
                        name: 'symbol';
                        type: 'string';
                    },
                    {
                        name: 'description';
                        type: 'string';
                    },
                    {
                        name: 'url';
                        type: 'string';
                    },
                    {
                        name: 'assets';
                        type: {
                            vec: {
                                defined: {
                                    name: 'etfAsset';
                                };
                            };
                        };
                    },
                ];
            };
        },
        {
            name: 'etfTokenBurnEvent';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'etfTokenMint';
                        type: 'pubkey';
                    },
                    {
                        name: 'authority';
                        type: 'pubkey';
                    },
                    {
                        name: 'lamports';
                        type: 'f64';
                    },
                ];
            };
        },
        {
            name: 'etfTokenCreateEvent';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'etfTokenMint';
                        type: 'pubkey';
                    },
                    {
                        name: 'creator';
                        type: 'pubkey';
                    },
                ];
            };
        },
        {
            name: 'etfTokenMintEvent';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'etfTokenMint';
                        type: 'pubkey';
                    },
                    {
                        name: 'authority';
                        type: 'pubkey';
                    },
                    {
                        name: 'lamports';
                        type: 'f64';
                    },
                ];
            };
        },
        {
            name: 'iswap';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'count';
                        type: 'u8';
                    },
                ];
            };
        },
        {
            name: 'pointsConfig';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'etfCreatePointsReward';
                        type: 'u64';
                    },
                    {
                        name: 'kisuneLevelNeeded';
                        type: 'u64';
                    },
                    {
                        name: 'toraLevelNeeded';
                        type: 'u64';
                    },
                    {
                        name: 'ryuLevelNeeded';
                        type: 'u64';
                    },
                    {
                        name: 'oniLevelNeeded';
                        type: 'u64';
                    },
                    {
                        name: 'kamiLevelNeeded';
                        type: 'u64';
                    },
                ];
            };
        },
        {
            name: 'pointsRewardType';
            type: {
                kind: 'enum';
                variants: [
                    {
                        name: 'etFmint';
                    },
                    {
                        name: 'inviteUser';
                    },
                    {
                        name: 'advertise';
                    },
                ];
            };
        },
        {
            name: 'userAccount';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'owner';
                        type: 'pubkey';
                    },
                    {
                        name: 'isFrozen';
                        type: 'bool';
                    },
                    {
                        name: 'createdAt';
                        type: 'i64';
                    },
                    {
                        name: 'inviterCode';
                        type: {
                            option: 'pubkey';
                        };
                    },
                    {
                        name: 'directInviter';
                        type: {
                            option: 'pubkey';
                        };
                    },
                    {
                        name: 'nickname';
                        type: 'string';
                    },
                    {
                        name: 'avatar';
                        type: 'string';
                    },
                    {
                        name: 'padding';
                        type: {
                            array: ['u64', 10];
                        };
                    },
                ];
            };
        },
        {
            name: 'userInitialized';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'user';
                        type: 'pubkey';
                    },
                    {
                        name: 'inviterCode';
                        type: {
                            option: 'pubkey';
                        };
                    },
                    {
                        name: 'nickname';
                        type: 'string';
                    },
                    {
                        name: 'createdAt';
                        type: 'i64';
                    },
                ];
            };
        },
        {
            name: 'userModelConfig';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'points';
                        type: {
                            defined: {
                                name: 'pointsConfig';
                            };
                        };
                    },
                    {
                        name: 'padding';
                        type: {
                            array: ['u64', 15];
                        };
                    },
                ];
            };
        },
    ];
};
