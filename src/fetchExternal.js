"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.forTruffleConfig = exports.fetchExternal = void 0;
var Compile = require("@truffle/compile-solidity").Compile;
var Codec = require("@truffle/codec");
var source_fetcher_1 = require("@truffle/source-fetcher");
function fetchExternal(_a) {
    var config = _a.config, address = _a.address;
    return __awaiter(this, void 0, void 0, function () {
        var _b, contractName, result, projectInfo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fetchAndCompile({ config: config, address: address })];
                case 1:
                    _b = _c.sent(), contractName = _b.contractName, result = _b.result;
                    projectInfo = { compilations: Codec.Compilations.Utils.shimCompilations(result.compilations) };
                    return [2 /*return*/, projectInfo];
            }
        });
    });
}
exports.fetchExternal = fetchExternal;
/**
 * Accepts a TruffleConfig and returns a priority-sorted list of fetchers based
 * on provided configuration and whether available fetchers support the current
 * blockchain network.
 * @dev HACK this currently only supports EtherscanFetcher
 */
function forTruffleConfig(options) {
    return __awaiter(this, void 0, void 0, function () {
        var config, networkId, constructors, fetchers;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = options.config;
                    networkId = parseInt(config.network_id);
                    constructors = config.sourceFetchers
                        ? config.sourceFetchers.map(function (sourceFetcherName) {
                            var Fetcher = source_fetcher_1["default"].find(function (Fetcher) { return Fetcher.fetcherName === sourceFetcherName; });
                            if (!Fetcher) {
                                throw new Error("Unknown external source servce " + sourceFetcherName + ".");
                            }
                            return Fetcher;
                        })
                        : source_fetcher_1["default"];
                    return [4 /*yield*/, Promise.all(constructors
                            // HACK only support EtherscanFetcher right now
                            .filter(function (_a) {
                            var fetcherName = _a.fetcherName;
                            return fetcherName === "etherscan";
                        })
                            .map(function (Fetcher) { return __awaiter(_this, void 0, void 0, function () {
                            var options, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        options = config[Fetcher.fetcherName];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, Fetcher.forNetworkId(networkId, options)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                    case 3:
                                        error_1 = _a.sent();
                                        if (!(error_1 instanceof source_fetcher_1.InvalidNetworkError)) {
                                            throw error_1;
                                        }
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    fetchers = _a.sent();
                    return [2 /*return*/, fetchers.filter(function (fetcher) { return !!fetcher; })];
            }
        });
    });
}
exports.forTruffleConfig = forTruffleConfig;
function fetchAndCompile(options) {
    return __awaiter(this, void 0, void 0, function () {
        var config, address, fetchers, _i, fetchers_1, fetcher, result, error_2, contractName, sources, options_1, externalConfig;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = options.config, address = options.address;
                    return [4 /*yield*/, forTruffleConfig({ config: config })];
                case 1:
                    fetchers = _b.sent();
                    _i = 0, fetchers_1 = fetchers;
                    _b.label = 2;
                case 2:
                    if (!(_i < fetchers_1.length)) return [3 /*break*/, 9];
                    fetcher = fetchers_1[_i];
                    result = void 0;
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, fetcher.fetchSourcesForAddress(address)];
                case 4:
                    result = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    return [3 /*break*/, 8];
                case 6:
                    if (result === null) {
                        //null means they don't have that address
                        return [3 /*break*/, 8];
                    }
                    contractName = result.contractName, sources = result.sources, options_1 = result.options;
                    if (options_1.language !== "Solidity") {
                        //if it's not Solidity, bail out now
                        //break out of the fetcher loop, since *no* fetcher will work here
                        return [3 /*break*/, 9];
                    }
                    externalConfig = config["with"]({
                        compilers: {
                            solc: options_1
                        },
                        quiet: true
                    })
                        .merge({
                        //turn on docker if the original config has docker
                        compilers: {
                            solc: {
                                docker: ((config.compilers || {}).solc || {}).docker
                            }
                        }
                    });
                    _a = {
                        contractName: contractName
                    };
                    return [4 /*yield*/, Compile.sources({
                            options: externalConfig,
                            sources: sources
                        })];
                case 7: return [2 /*return*/, (_a.result = _b.sent(),
                        _a)];
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: throw new Error("Unable to find");
            }
        });
    });
}
function findContract(options) {
    return __awaiter(this, void 0, void 0, function () {
        var contractName, contracts, matching;
        return __generator(this, function (_a) {
            contractName = options.contractName, contracts = options.contracts;
            // simple case; we get the contract name and it matches exactly one contract
            if (contractName) {
                matching = contracts.filter(function (contract) { return contract.contractName === contractName; });
                if (matching.length === 1) {
                    return [2 /*return*/, matching[0]];
                }
            }
            throw new Error("Contract " + contractName + " not loaded into @truffle/db.");
        });
    });
}
