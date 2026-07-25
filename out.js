var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component4.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component4(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e2) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x2) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x2) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement2(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement2(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement2(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c2) {
            return c2;
          })) : null != callback && (isValidElement2(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement2(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i2 = 0; i2 < children.length; i2++)
            nameSoFar = children[i2], type = childKey + getElementKey(nameSoFar, i2), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i2 = getIteratorFn(children), "function" === typeof i2)
          for (i2 === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i2.call(children), i2 = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i2++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i2 = 0;
          try {
            for (; i2 < queue.length; i2++) {
              var callback = queue[i2];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i2] = callback;
                    queue.splice(0, i2);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i2 + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component4.prototype.isReactComponent = {};
      Component4.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component4.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component4.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component4.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n3 = 0;
          mapChildren(children, function() {
            n3++;
          });
          return n3;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement2(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component4;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i2 = 0; i2 < propName; i2++)
            JSCompiler_inline_result[i2] = arguments[i2 + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i2 = 2; i2 < arguments.length; i2++)
          validateChildKeys(arguments[i2]);
        i2 = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i2[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i2.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i2.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i2[propName] && (i2[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i2,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i2,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement2;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.2.0";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    (function() {
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x2) {
              }
          }
        return null;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e2) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x2) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children)
          if (isStaticChildren)
            if (isArrayImpl(children)) {
              for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                validateChildKeys(children[isStaticChildren]);
              Object.freeze && Object.freeze(children);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
          children = getComponentNameFromType(type);
          var keys = Object.keys(config).filter(function(k2) {
            return "key" !== k2;
          });
          isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
          didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
            isStaticChildren,
            children,
            keys,
            children
          ), didWarnAboutKeySpread[children + isStaticChildren] = true);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(
          maybeKey,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        return ReactElement(
          type,
          children,
          maybeKey,
          getOwner(),
          debugStack,
          debugTask
        );
      }
      function validateChildKeys(node) {
        isValidElement2(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement2(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement2(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var React17 = require_react(), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React17.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      React17 = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = React17.react_stack_bottom_frame.bind(
        React17,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutKeySpread = {};
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          false,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.jsxs = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          true,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
    })();
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  }
});

// src/components/AdminDashboard.tsx
var import_react38 = __toESM(require_react(), 1);

// node_modules/convex/dist/esm/react/use_paginated_query.js
var import_react4 = __toESM(require_react(), 1);

// node_modules/convex/dist/esm/values/base64.js
var lookup = [];
var revLookup = [];
var Arr = Uint8Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (i2 = 0, len = code.length; i2 < len; ++i2) {
  lookup[i2] = code[i2];
  revLookup[code.charCodeAt(i2)] = i2;
}
var i2;
var len;
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  var validLen = b64.indexOf("=");
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
function _byteLength(_b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr2 = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i2;
  for (i2 = 0; i2 < len; i2 += 4) {
    tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
    arr2[curByte++] = tmp >> 16 & 255;
    arr2[curByte++] = tmp >> 8 & 255;
    arr2[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
    arr2[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
    arr2[curByte++] = tmp >> 8 & 255;
    arr2[curByte++] = tmp & 255;
  }
  return arr2;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i2 = start; i2 < end; i2 += 3) {
    tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var parts = [];
  var maxChunkLength = 16383;
  for (var i2 = 0, len2 = len - extraBytes; i2 < len2; i2 += maxChunkLength) {
    parts.push(
      encodeChunk(
        uint8,
        i2,
        i2 + maxChunkLength > len2 ? len2 : i2 + maxChunkLength
      )
    );
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
    );
  }
  return parts.join("");
}

// node_modules/convex/dist/esm/common/index.js
function parseArgs(args) {
  if (args === void 0) {
    return {};
  }
  if (!isSimpleObject(args)) {
    throw new Error(
      `The arguments to a Convex function must be an object. Received: ${args}`
    );
  }
  return args;
}
function isSimpleObject(value) {
  const isObject = typeof value === "object";
  const prototype = Object.getPrototypeOf(value);
  const isSimple = prototype === null || prototype === Object.prototype || // Objects generated from other contexts (e.g. across Node.js `vm` modules) will not satisfy the previous
  // conditions but are still simple objects.
  prototype?.constructor?.name === "Object";
  return isObject && isSimple;
}

// node_modules/convex/dist/esm/values/value.js
var LITTLE_ENDIAN = true;
var MIN_INT64 = BigInt("-9223372036854775808");
var MAX_INT64 = BigInt("9223372036854775807");
var ZERO = BigInt("0");
var EIGHT = BigInt("8");
var TWOFIFTYSIX = BigInt("256");
function isSpecial(n3) {
  return Number.isNaN(n3) || !Number.isFinite(n3) || Object.is(n3, -0);
}
function slowBigIntToBase64(value) {
  if (value < ZERO) {
    value -= MIN_INT64 + MIN_INT64;
  }
  let hex = value.toString(16);
  if (hex.length % 2 === 1) hex = "0" + hex;
  const bytes = new Uint8Array(new ArrayBuffer(8));
  let i2 = 0;
  for (const hexByte of hex.match(/.{2}/g).reverse()) {
    bytes.set([parseInt(hexByte, 16)], i2++);
    value >>= EIGHT;
  }
  return fromByteArray(bytes);
}
function slowBase64ToBigInt(encoded) {
  const integerBytes = toByteArray(encoded);
  if (integerBytes.byteLength !== 8) {
    throw new Error(
      `Received ${integerBytes.byteLength} bytes, expected 8 for $integer`
    );
  }
  let value = ZERO;
  let power = ZERO;
  for (const byte of integerBytes) {
    value += BigInt(byte) * TWOFIFTYSIX ** power;
    power++;
  }
  if (value > MAX_INT64) {
    value += MIN_INT64 + MIN_INT64;
  }
  return value;
}
function modernBigIntToBase64(value) {
  if (value < MIN_INT64 || MAX_INT64 < value) {
    throw new Error(
      `BigInt ${value} does not fit into a 64-bit signed integer.`
    );
  }
  const buffer = new ArrayBuffer(8);
  new DataView(buffer).setBigInt64(0, value, true);
  return fromByteArray(new Uint8Array(buffer));
}
function modernBase64ToBigInt(encoded) {
  const integerBytes = toByteArray(encoded);
  if (integerBytes.byteLength !== 8) {
    throw new Error(
      `Received ${integerBytes.byteLength} bytes, expected 8 for $integer`
    );
  }
  const intBytesView = new DataView(integerBytes.buffer);
  return intBytesView.getBigInt64(0, true);
}
var bigIntToBase64 = DataView.prototype.setBigInt64 ? modernBigIntToBase64 : slowBigIntToBase64;
var base64ToBigInt = DataView.prototype.getBigInt64 ? modernBase64ToBigInt : slowBase64ToBigInt;
var MAX_IDENTIFIER_LEN = 1024;
function validateObjectField(k2) {
  if (k2.length > MAX_IDENTIFIER_LEN) {
    throw new Error(
      `Field name ${k2} exceeds maximum field name length ${MAX_IDENTIFIER_LEN}.`
    );
  }
  if (k2.startsWith("$")) {
    throw new Error(`Field name ${k2} starts with a '$', which is reserved.`);
  }
  for (let i2 = 0; i2 < k2.length; i2 += 1) {
    const charCode = k2.charCodeAt(i2);
    if (charCode < 32 || charCode >= 127) {
      throw new Error(
        `Field name ${k2} has invalid character '${k2[i2]}': Field names can only contain non-control ASCII characters`
      );
    }
  }
}
var MAX_VALUE_FOR_ERROR_LEN = 16384;
function stringifyValueForError(value) {
  const str = JSON.stringify(value, (_key, value2) => {
    if (value2 === void 0) {
      return "undefined";
    }
    if (typeof value2 === "bigint") {
      return `${value2.toString()}n`;
    }
    return value2;
  });
  if (str.length > MAX_VALUE_FOR_ERROR_LEN) {
    const rest = "[...truncated]";
    let truncateAt = MAX_VALUE_FOR_ERROR_LEN - rest.length;
    const codePoint = str.codePointAt(truncateAt - 1);
    if (codePoint !== void 0 && codePoint > 65535) {
      truncateAt -= 1;
    }
    return str.substring(0, truncateAt) + rest;
  }
  return str;
}
function convexToJsonInternal(value, originalValue, context, includeTopLevelUndefined) {
  if (value === void 0) {
    const contextText = context && ` (present at path ${context} in original object ${stringifyValueForError(
      originalValue
    )})`;
    throw new Error(
      `undefined is not a valid Convex value${contextText}. To learn about Convex's supported types, see https://docs.convex.dev/using/types.`
    );
  }
  if (value === null) {
    return value;
  }
  if (typeof value === "bigint") {
    if (value < MIN_INT64 || MAX_INT64 < value) {
      throw new Error(
        `BigInt ${value} does not fit into a 64-bit signed integer.`
      );
    }
    return { $integer: bigIntToBase64(value) };
  }
  if (typeof value === "number") {
    if (isSpecial(value)) {
      const buffer = new ArrayBuffer(8);
      new DataView(buffer).setFloat64(0, value, LITTLE_ENDIAN);
      return { $float: fromByteArray(new Uint8Array(buffer)) };
    } else {
      return value;
    }
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value;
  }
  if (value instanceof ArrayBuffer) {
    return { $bytes: fromByteArray(new Uint8Array(value)) };
  }
  if (Array.isArray(value)) {
    return value.map(
      (value2, i2) => convexToJsonInternal(value2, originalValue, context + `[${i2}]`, false)
    );
  }
  if (value instanceof Set) {
    throw new Error(
      errorMessageForUnsupportedType(context, "Set", [...value], originalValue)
    );
  }
  if (value instanceof Map) {
    throw new Error(
      errorMessageForUnsupportedType(context, "Map", [...value], originalValue)
    );
  }
  if (!isSimpleObject(value)) {
    const theType = value?.constructor?.name;
    const typeName = theType ? `${theType} ` : "";
    throw new Error(
      errorMessageForUnsupportedType(context, typeName, value, originalValue)
    );
  }
  const out = {};
  const entries = Object.entries(value);
  entries.sort(([k1, _v1], [k2, _v2]) => k1 === k2 ? 0 : k1 < k2 ? -1 : 1);
  for (const [k2, v3] of entries) {
    if (v3 !== void 0) {
      validateObjectField(k2);
      out[k2] = convexToJsonInternal(v3, originalValue, context + `.${k2}`, false);
    } else if (includeTopLevelUndefined) {
      validateObjectField(k2);
      out[k2] = convexOrUndefinedToJsonInternal(
        v3,
        originalValue,
        context + `.${k2}`
      );
    }
  }
  return out;
}
function errorMessageForUnsupportedType(context, typeName, value, originalValue) {
  if (context) {
    return `${typeName}${stringifyValueForError(
      value
    )} is not a supported Convex type (present at path ${context} in original object ${stringifyValueForError(
      originalValue
    )}). To learn about Convex's supported types, see https://docs.convex.dev/using/types.`;
  } else {
    return `${typeName}${stringifyValueForError(
      value
    )} is not a supported Convex type.`;
  }
}
function convexOrUndefinedToJsonInternal(value, originalValue, context) {
  if (value === void 0) {
    return { $undefined: null };
  } else {
    if (originalValue === void 0) {
      throw new Error(
        `Programming error. Current value is ${stringifyValueForError(
          value
        )} but original value is undefined`
      );
    }
    return convexToJsonInternal(value, originalValue, context, false);
  }
}
function convexToJson(value) {
  return convexToJsonInternal(value, value, "", false);
}

// node_modules/convex/dist/esm/values/validators.js
var __defProp2 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var UNDEFINED_VALIDATOR_ERROR_URL = "https://docs.convex.dev/error#undefined-validator";
function throwUndefinedValidatorError(context, fieldName) {
  const fieldInfo = fieldName !== void 0 ? ` for field "${fieldName}"` : "";
  throw new Error(
    `A validator is undefined${fieldInfo} in ${context}. This is often caused by circular imports. See ${UNDEFINED_VALIDATOR_ERROR_URL} for details.`
  );
}
var BaseValidator = class {
  constructor({ isOptional }) {
    __publicField(this, "type");
    __publicField(this, "fieldPaths");
    __publicField(this, "isOptional");
    __publicField(this, "isConvexValidator");
    this.isOptional = isOptional;
    this.isConvexValidator = true;
  }
};
var VId = class _VId extends BaseValidator {
  /**
   * Usually you'd use `v.id(tableName)` instead.
   */
  constructor({
    isOptional,
    tableName
  }) {
    super({ isOptional });
    __publicField(this, "tableName");
    __publicField(this, "kind", "id");
    if (typeof tableName !== "string") {
      throw new Error("v.id(tableName) requires a string");
    }
    this.tableName = tableName;
  }
  /** @internal */
  get json() {
    return { type: "id", tableName: this.tableName };
  }
  /** @internal */
  asOptional() {
    return new _VId({
      isOptional: "optional",
      tableName: this.tableName
    });
  }
};
var VFloat64 = class _VFloat64 extends BaseValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "kind", "float64");
  }
  /** @internal */
  get json() {
    return { type: "number" };
  }
  /** @internal */
  asOptional() {
    return new _VFloat64({
      isOptional: "optional"
    });
  }
};
var VInt64 = class _VInt64 extends BaseValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "kind", "int64");
  }
  /** @internal */
  get json() {
    return { type: "bigint" };
  }
  /** @internal */
  asOptional() {
    return new _VInt64({ isOptional: "optional" });
  }
};
var VBoolean = class _VBoolean extends BaseValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "kind", "boolean");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new _VBoolean({
      isOptional: "optional"
    });
  }
};
var VBytes = class _VBytes extends BaseValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "kind", "bytes");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new _VBytes({ isOptional: "optional" });
  }
};
var VString = class _VString extends BaseValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "kind", "string");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new _VString({
      isOptional: "optional"
    });
  }
};
var VNull = class _VNull extends BaseValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "kind", "null");
  }
  /** @internal */
  get json() {
    return { type: this.kind };
  }
  /** @internal */
  asOptional() {
    return new _VNull({ isOptional: "optional" });
  }
};
var VAny = class _VAny extends BaseValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "kind", "any");
  }
  /** @internal */
  get json() {
    return {
      type: this.kind
    };
  }
  /** @internal */
  asOptional() {
    return new _VAny({
      isOptional: "optional"
    });
  }
};
var VObject = class _VObject extends BaseValidator {
  /**
   * Usually you'd use `v.object({ ... })` instead.
   */
  constructor({
    isOptional,
    fields
  }) {
    super({ isOptional });
    __publicField(this, "fields");
    __publicField(this, "kind", "object");
    globalThis.Object.entries(fields).forEach(([fieldName, validator]) => {
      if (validator === void 0) {
        throwUndefinedValidatorError("v.object()", fieldName);
      }
      if (!validator.isConvexValidator) {
        throw new Error("v.object() entries must be validators");
      }
    });
    this.fields = fields;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: globalThis.Object.fromEntries(
        globalThis.Object.entries(this.fields).map(([k2, v3]) => [
          k2,
          {
            fieldType: v3.json,
            optional: v3.isOptional === "optional" ? true : false
          }
        ])
      )
    };
  }
  /** @internal */
  asOptional() {
    return new _VObject({
      isOptional: "optional",
      fields: this.fields
    });
  }
  /**
   * Create a new VObject with the specified fields omitted.
   * @param fields The field names to omit from this VObject.
   */
  omit(...fields) {
    const newFields = { ...this.fields };
    for (const field of fields) {
      delete newFields[field];
    }
    return new _VObject({
      isOptional: this.isOptional,
      fields: newFields
    });
  }
  /**
   * Create a new VObject with only the specified fields.
   * @param fields The field names to pick from this VObject.
   */
  pick(...fields) {
    const newFields = {};
    for (const field of fields) {
      newFields[field] = this.fields[field];
    }
    return new _VObject({
      isOptional: this.isOptional,
      fields: newFields
    });
  }
  /**
   * Create a new VObject with all fields marked as optional.
   */
  partial() {
    const newFields = {};
    for (const [key, validator] of globalThis.Object.entries(this.fields)) {
      newFields[key] = validator.asOptional();
    }
    return new _VObject({
      isOptional: this.isOptional,
      fields: newFields
    });
  }
  /**
   * Create a new VObject with additional fields merged in.
   * @param fields An object with additional validators to merge into this VObject.
   */
  extend(fields) {
    return new _VObject({
      isOptional: this.isOptional,
      fields: { ...this.fields, ...fields }
    });
  }
};
var VLiteral = class _VLiteral extends BaseValidator {
  /**
   * Usually you'd use `v.literal(value)` instead.
   */
  constructor({ isOptional, value }) {
    super({ isOptional });
    __publicField(this, "value");
    __publicField(this, "kind", "literal");
    if (typeof value !== "string" && typeof value !== "boolean" && typeof value !== "number" && typeof value !== "bigint") {
      throw new Error("v.literal(value) must be a string, number, or boolean");
    }
    this.value = value;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: convexToJson(this.value)
    };
  }
  /** @internal */
  asOptional() {
    return new _VLiteral({
      isOptional: "optional",
      value: this.value
    });
  }
};
var VArray = class _VArray extends BaseValidator {
  /**
   * Usually you'd use `v.array(element)` instead.
   */
  constructor({
    isOptional,
    element
  }) {
    super({ isOptional });
    __publicField(this, "element");
    __publicField(this, "kind", "array");
    if (element === void 0) {
      throwUndefinedValidatorError("v.array()");
    }
    this.element = element;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: this.element.json
    };
  }
  /** @internal */
  asOptional() {
    return new _VArray({
      isOptional: "optional",
      element: this.element
    });
  }
};
var VRecord = class _VRecord extends BaseValidator {
  /**
   * Usually you'd use `v.record(key, value)` instead.
   */
  constructor({
    isOptional,
    key,
    value
  }) {
    super({ isOptional });
    __publicField(this, "key");
    __publicField(this, "value");
    __publicField(this, "kind", "record");
    if (key === void 0) {
      throwUndefinedValidatorError("v.record()", "key");
    }
    if (value === void 0) {
      throwUndefinedValidatorError("v.record()", "value");
    }
    if (key.isOptional === "optional") {
      throw new Error("Record validator cannot have optional keys");
    }
    if (value.isOptional === "optional") {
      throw new Error("Record validator cannot have optional values");
    }
    if (!key.isConvexValidator || !value.isConvexValidator) {
      throw new Error("Key and value of v.record() but be validators");
    }
    this.key = key;
    this.value = value;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      // This cast is needed because TypeScript thinks the key type is too wide
      keys: this.key.json,
      values: {
        fieldType: this.value.json,
        optional: false
      }
    };
  }
  /** @internal */
  asOptional() {
    return new _VRecord({
      isOptional: "optional",
      key: this.key,
      value: this.value
    });
  }
};
var VUnion = class _VUnion extends BaseValidator {
  /**
   * Usually you'd use `v.union(...members)` instead.
   */
  constructor({ isOptional, members }) {
    super({ isOptional });
    __publicField(this, "members");
    __publicField(this, "kind", "union");
    members.forEach((member, index) => {
      if (member === void 0) {
        throwUndefinedValidatorError("v.union()", `member at index ${index}`);
      }
      if (!member.isConvexValidator) {
        throw new Error("All members of v.union() must be validators");
      }
    });
    this.members = members;
  }
  /** @internal */
  get json() {
    return {
      type: this.kind,
      value: this.members.map((v3) => v3.json)
    };
  }
  /** @internal */
  asOptional() {
    return new _VUnion({
      isOptional: "optional",
      members: this.members
    });
  }
};

// node_modules/convex/dist/esm/values/validator.js
function isValidator(v22) {
  return !!v22.isConvexValidator;
}
var v = {
  /**
   * Validates that the value is a document ID for the given table.
   *
   * IDs are strings at runtime but are typed as `Id<"tableName">` in
   * TypeScript for type safety.
   *
   * @example
   * ```typescript
   * args: { userId: v.id("users") }
   * ```
   *
   * @param tableName The name of the table.
   */
  id: (tableName) => {
    return new VId({
      isOptional: "required",
      tableName
    });
  },
  /**
   * Validates that the value is `null`.
   *
   * Use `returns: v.null()` for functions that don't return a meaningful value.
   * JavaScript `undefined` is not a valid Convex value, it is automatically
   * converted to `null`.
   */
  null: () => {
    return new VNull({ isOptional: "required" });
  },
  /**
   * Validates that the value is a JavaScript `number` (Convex Float64).
   *
   * Supports all IEEE-754 double-precision floating point numbers including
   * NaN and Infinity.
   *
   * Alias for `v.float64()`.
   */
  number: () => {
    return new VFloat64({ isOptional: "required" });
  },
  /**
   * Validates that the value is a JavaScript `number` (Convex Float64).
   *
   * Supports all IEEE-754 double-precision floating point numbers.
   */
  float64: () => {
    return new VFloat64({ isOptional: "required" });
  },
  /**
   * @deprecated Use `v.int64()` instead.
   */
  bigint: () => {
    return new VInt64({ isOptional: "required" });
  },
  /**
   * Validates that the value is a JavaScript `bigint` (Convex Int64).
   *
   * Supports BigInts between -2^63 and 2^63-1.
   *
   * @example
   * ```typescript
   * args: { timestamp: v.int64() }
   * // Usage: createDoc({ timestamp: 1234567890n })
   * ```
   */
  int64: () => {
    return new VInt64({ isOptional: "required" });
  },
  /**
   * Validates that the value is a `boolean`.
   */
  boolean: () => {
    return new VBoolean({ isOptional: "required" });
  },
  /**
   * Validates that the value is a `string`.
   *
   * Strings are stored as UTF-8 and their storage size is calculated as their
   * UTF-8 encoded size.
   */
  string: () => {
    return new VString({ isOptional: "required" });
  },
  /**
   * Validates that the value is an `ArrayBuffer` (Convex Bytes).
   *
   * Use for binary data.
   */
  bytes: () => {
    return new VBytes({ isOptional: "required" });
  },
  /**
   * Validates that the value is exactly equal to the given literal.
   *
   * Useful for discriminated unions and enum-like patterns.
   *
   * @example
   * ```typescript
   * // Discriminated union pattern:
   * v.union(
   *   v.object({ kind: v.literal("error"), message: v.string() }),
   *   v.object({ kind: v.literal("success"), value: v.number() }),
   * )
   * ```
   *
   * @param literal The literal value to compare against.
   */
  literal: (literal) => {
    return new VLiteral({ isOptional: "required", value: literal });
  },
  /**
   * Validates that the value is an `Array` where every element matches the
   * given validator.
   *
   * Arrays can have at most 8192 elements.
   *
   * @example
   * ```typescript
   * args: { tags: v.array(v.string()) }
   * args: { coordinates: v.array(v.number()) }
   * args: { items: v.array(v.object({ name: v.string(), qty: v.number() })) }
   * ```
   *
   * @param element The validator for the elements of the array.
   */
  array: (element) => {
    return new VArray({ isOptional: "required", element });
  },
  /**
   * Validates that the value is an `Object` with the specified properties.
   *
   * Objects can have at most 1024 entries. Field names must be non-empty and
   * must not start with `"$"` or `"_"` (`_` is reserved for system fields
   * like `_id` and `_creationTime`; `$` is reserved for Convex internal use).
   *
   * @example
   * ```typescript
   * args: {
   *   user: v.object({
   *     name: v.string(),
   *     email: v.string(),
   *     age: v.optional(v.number()),
   *   })
   * }
   * ```
   *
   * @param fields An object mapping property names to their validators.
   */
  object: (fields) => {
    return new VObject({ isOptional: "required", fields });
  },
  /**
   * Validates that the value is a `Record` (object with dynamic keys).
   *
   * Records are objects at runtime but allow dynamic keys, unlike `v.object()`
   * which requires known property names. Keys must be ASCII characters only,
   * non-empty, and not start with `"$"` or `"_"`.
   *
   * @example
   * ```typescript
   * // Map of user IDs to scores:
   * args: { scores: v.record(v.id("users"), v.number()) }
   *
   * // Map of string keys to string values:
   * args: { metadata: v.record(v.string(), v.string()) }
   * ```
   *
   * @param keys The validator for the keys of the record.
   * @param values The validator for the values of the record.
   */
  record: (keys, values) => {
    return new VRecord({
      isOptional: "required",
      key: keys,
      value: values
    });
  },
  /**
   * Validates that the value matches at least one of the given validators.
   *
   * @example
   * ```typescript
   * // Allow string or number:
   * args: { value: v.union(v.string(), v.number()) }
   *
   * // Discriminated union (recommended pattern):
   * v.union(
   *   v.object({ kind: v.literal("text"), body: v.string() }),
   *   v.object({ kind: v.literal("image"), url: v.string() }),
   * )
   *
   * // Nullable value:
   * returns: v.union(v.object({ ... }), v.null())
   * ```
   *
   * @param members The validators to match against.
   */
  union: (...members) => {
    return new VUnion({
      isOptional: "required",
      members
    });
  },
  /**
   * A validator that accepts any Convex value without validation.
   *
   * Prefer using specific validators when possible for better type safety
   * and runtime validation.
   */
  any: () => {
    return new VAny({ isOptional: "required" });
  },
  /**
   * Makes a property optional in an object validator.
   *
   * An optional property can be omitted entirely when creating a document or
   * calling a function. This is different from `v.nullable()` which requires
   * the property to be present but allows `null`.
   *
   * @example
   * ```typescript
   * v.object({
   *   name: v.string(),              // required
   *   nickname: v.optional(v.string()), // can be omitted
   * })
   *
   * // Valid: { name: "Alice" }
   * // Valid: { name: "Alice", nickname: "Ali" }
   * // Invalid: { name: "Alice", nickname: null }  - use v.nullable() for this
   * ```
   *
   * @param value The property value validator to make optional.
   */
  optional: (value) => {
    return value.asOptional();
  },
  /**
   * Allows a value to be either the given type or `null`.
   *
   * This is shorthand for `v.union(value, v.null())`. Unlike `v.optional()`,
   * the property must still be present, but may be `null`.
   *
   * @example
   * ```typescript
   * v.object({
   *   name: v.string(),
   *   deletedAt: v.nullable(v.number()), // must be present, can be null
   * })
   *
   * // Valid: { name: "Alice", deletedAt: null }
   * // Valid: { name: "Alice", deletedAt: 1234567890 }
   * // Invalid: { name: "Alice" }  - deletedAt is required
   * ```
   */
  nullable: (value) => {
    return v.union(value, v.null());
  }
};

// node_modules/convex/dist/esm/values/errors.js
var __defProp3 = Object.defineProperty;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField2 = (obj, key, value) => __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a;
var _b;
var IDENTIFYING_FIELD = Symbol.for("ConvexError");
var ConvexError = class extends (_b = Error, _a = IDENTIFYING_FIELD, _b) {
  constructor(data2) {
    super(typeof data2 === "string" ? data2 : stringifyValueForError(data2));
    __publicField2(this, "name", "ConvexError");
    __publicField2(this, "data");
    __publicField2(this, _a, true);
    this.data = data2;
  }
};

// node_modules/convex/dist/esm/values/compare_utf8.js
var arr = () => Array.from({ length: 4 }, () => 0);
var aBytes = arr();
var bBytes = arr();

// node_modules/convex/dist/esm/react/use_queries.js
var import_react3 = __toESM(require_react(), 1);

// node_modules/convex/dist/esm/server/functionName.js
var functionName = Symbol.for("functionName");

// node_modules/convex/dist/esm/server/components/paths.js
var toReferencePath = Symbol.for("toReferencePath");
function extractReferencePath(reference) {
  return reference[toReferencePath] ?? null;
}
function isFunctionHandle(s2) {
  return s2.startsWith("function://");
}
function getFunctionAddress(functionReference) {
  let functionAddress;
  if (typeof functionReference === "string") {
    if (isFunctionHandle(functionReference)) {
      functionAddress = { functionHandle: functionReference };
    } else {
      functionAddress = { name: functionReference };
    }
  } else if (functionReference[functionName]) {
    functionAddress = { name: functionReference[functionName] };
  } else {
    const referencePath = extractReferencePath(functionReference);
    if (!referencePath) {
      throw new Error(`${functionReference} is not a functionReference`);
    }
    functionAddress = { reference: referencePath };
  }
  return functionAddress;
}

// node_modules/convex/dist/esm/server/api.js
function getFunctionName(functionReference) {
  const address = getFunctionAddress(functionReference);
  if (address.name === void 0) {
    if (address.functionHandle !== void 0) {
      throw new Error(
        `Expected function reference like "api.file.func" or "internal.file.func", but received function handle ${address.functionHandle}`
      );
    } else if (address.reference !== void 0) {
      throw new Error(
        `Expected function reference in the current component like "api.file.func" or "internal.file.func", but received reference ${address.reference}`
      );
    }
    throw new Error(
      `Expected function reference like "api.file.func" or "internal.file.func", but received ${JSON.stringify(address)}`
    );
  }
  if (typeof functionReference === "string") return functionReference;
  const name = functionReference[functionName];
  if (!name) {
    throw new Error(`${functionReference} is not a functionReference`);
  }
  return name;
}
function makeFunctionReference(name) {
  return { [functionName]: name };
}
function createApi(pathParts = []) {
  const handler = {
    get(_2, prop) {
      if (typeof prop === "string") {
        const newParts = [...pathParts, prop];
        return createApi(newParts);
      } else if (prop === functionName) {
        if (pathParts.length < 2) {
          const found = ["api", ...pathParts].join(".");
          throw new Error(
            `API path is expected to be of the form \`api.moduleName.functionName\`. Found: \`${found}\``
          );
        }
        const path = pathParts.slice(0, -1).join("/");
        const exportName = pathParts[pathParts.length - 1];
        if (exportName === "default") {
          return path;
        } else {
          return path + ":" + exportName;
        }
      } else if (prop === Symbol.toStringTag) {
        return "FunctionReference";
      } else {
        return void 0;
      }
    }
  };
  return new Proxy({}, handler);
}
var anyApi = createApi();

// node_modules/convex/dist/esm/vendor/long.js
var __defProp4 = Object.defineProperty;
var __defNormalProp3 = (obj, key, value) => key in obj ? __defProp4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField3 = (obj, key, value) => __defNormalProp3(obj, typeof key !== "symbol" ? key + "" : key, value);
var Long = class _Long {
  constructor(low, high) {
    __publicField3(this, "low");
    __publicField3(this, "high");
    __publicField3(this, "__isUnsignedLong__");
    this.low = low | 0;
    this.high = high | 0;
    this.__isUnsignedLong__ = true;
  }
  static isLong(obj) {
    return (obj && obj.__isUnsignedLong__) === true;
  }
  // prettier-ignore
  static fromBytesLE(bytes) {
    return new _Long(
      bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
      bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24
    );
  }
  // prettier-ignore
  toBytesLE() {
    const hi = this.high;
    const lo = this.low;
    return [
      lo & 255,
      lo >>> 8 & 255,
      lo >>> 16 & 255,
      lo >>> 24,
      hi & 255,
      hi >>> 8 & 255,
      hi >>> 16 & 255,
      hi >>> 24
    ];
  }
  static fromNumber(value) {
    if (isNaN(value)) return UZERO;
    if (value < 0) return UZERO;
    if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
    return new _Long(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0);
  }
  toString() {
    return (BigInt(this.high) * BigInt(TWO_PWR_32_DBL) + BigInt(this.low)).toString();
  }
  equals(other) {
    if (!_Long.isLong(other)) other = _Long.fromValue(other);
    if (this.high >>> 31 === 1 && other.high >>> 31 === 1) return false;
    return this.high === other.high && this.low === other.low;
  }
  notEquals(other) {
    return !this.equals(other);
  }
  comp(other) {
    if (!_Long.isLong(other)) other = _Long.fromValue(other);
    if (this.equals(other)) return 0;
    return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
  }
  lessThanOrEqual(other) {
    return this.comp(
      /* validates */
      other
    ) <= 0;
  }
  static fromValue(val) {
    if (typeof val === "number") return _Long.fromNumber(val);
    return new _Long(val.low, val.high);
  }
};
var UZERO = new Long(0, 0);
var TWO_PWR_16_DBL = 1 << 16;
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
var MAX_UNSIGNED_VALUE = new Long(4294967295 | 0, 4294967295 | 0);

// node_modules/convex/dist/esm/vendor/jwt-decode/index.js
var InvalidTokenError = class extends Error {
};
InvalidTokenError.prototype.name = "InvalidTokenError";

// node_modules/convex/dist/esm/browser/sync/authentication_manager.js
var MAXIMUM_REFRESH_DELAY = 20 * 24 * 60 * 60 * 1e3;

// node_modules/convex/dist/esm/react/client.js
var import_react2 = __toESM(require_react(), 1);

// node_modules/convex/dist/esm/react/use_subscription.js
var import_react = __toESM(require_react(), 1);
function useSubscription({
  // (Synchronously) returns the current value of our subscription.
  getCurrentValue,
  // This function is passed an event handler to attach to the subscription.
  // It should return an unsubscribe function that removes the handler.
  subscribe
}) {
  const [state, setState] = (0, import_react.useState)(() => ({
    getCurrentValue,
    subscribe,
    value: getCurrentValue()
  }));
  let valueToReturn = state.value;
  if (state.getCurrentValue !== getCurrentValue || state.subscribe !== subscribe) {
    valueToReturn = getCurrentValue();
    setState({
      getCurrentValue,
      subscribe,
      value: valueToReturn
    });
  }
  (0, import_react.useEffect)(() => {
    let didUnsubscribe = false;
    const checkForUpdates = () => {
      if (didUnsubscribe) {
        return;
      }
      setState((prevState) => {
        if (prevState.getCurrentValue !== getCurrentValue || prevState.subscribe !== subscribe) {
          return prevState;
        }
        const value = getCurrentValue();
        if (prevState.value === value) {
          return prevState;
        }
        return { ...prevState, value };
      });
    };
    const unsubscribe = subscribe(checkForUpdates);
    checkForUpdates();
    return () => {
      didUnsubscribe = true;
      unsubscribe();
    };
  }, [getCurrentValue, subscribe]);
  return valueToReturn;
}

// node_modules/convex/dist/esm/react/client.js
if (typeof import_react2.default === "undefined") {
  throw new Error("Required dependency 'react' not found");
}
function createMutation(mutationReference, client, update) {
  function mutation(args) {
    assertNotAccidentalArgument(args);
    return client.mutation(mutationReference, args, {
      optimisticUpdate: update
    });
  }
  mutation.withOptimisticUpdate = function withOptimisticUpdate(optimisticUpdate) {
    if (update !== void 0) {
      throw new Error(
        `Already specified optimistic update for mutation ${getFunctionName(
          mutationReference
        )}`
      );
    }
    return createMutation(mutationReference, client, optimisticUpdate);
  };
  return mutation;
}
function createAction(actionReference, client) {
  return function(args) {
    return client.action(actionReference, args);
  };
}
var ConvexContext = import_react2.default.createContext(
  void 0
  // in the future this will be a mocked client for testing
);
function useConvex() {
  return (0, import_react2.useContext)(ConvexContext);
}
function useQuery(query, ...args) {
  const skip = args[0] === "skip";
  const argsObject = args[0] === "skip" ? {} : parseArgs(args[0]);
  const queryReference = typeof query === "string" ? makeFunctionReference(query) : query;
  const queryName = getFunctionName(queryReference);
  const queries = (0, import_react2.useMemo)(
    () => skip ? {} : { query: { query: queryReference, args: argsObject } },
    // Stringify args so args that are semantically the same don't trigger a
    // rerender. Saves developers from adding `useMemo` on every args usage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(convexToJson(argsObject)), queryName, skip]
  );
  const results = useQueries(queries);
  const result = results["query"];
  if (result instanceof Error) {
    throw result;
  }
  return result;
}
function useMutation(mutation) {
  const mutationReference = typeof mutation === "string" ? makeFunctionReference(mutation) : mutation;
  const convex = (0, import_react2.useContext)(ConvexContext);
  if (convex === void 0) {
    throw new Error(
      "Could not find Convex client! `useMutation` must be used in the React component tree under `ConvexProvider`. Did you forget it? See https://docs.convex.dev/quick-start#set-up-convex-in-your-react-app"
    );
  }
  return (0, import_react2.useMemo)(
    () => createMutation(mutationReference, convex),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [convex, getFunctionName(mutationReference)]
  );
}
function useAction(action) {
  const convex = (0, import_react2.useContext)(ConvexContext);
  const actionReference = typeof action === "string" ? makeFunctionReference(action) : action;
  if (convex === void 0) {
    throw new Error(
      "Could not find Convex client! `useAction` must be used in the React component tree under `ConvexProvider`. Did you forget it? See https://docs.convex.dev/quick-start#set-up-convex-in-your-react-app"
    );
  }
  return (0, import_react2.useMemo)(
    () => createAction(actionReference, convex),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [convex, getFunctionName(actionReference)]
  );
}
function assertNotAccidentalArgument(value) {
  if (typeof value === "object" && value !== null && "bubbles" in value && "persist" in value && "isDefaultPrevented" in value) {
    throw new Error(
      `Convex function called with SyntheticEvent object. Did you use a Convex function as an event handler directly? Event handlers like onClick receive an event object as their first argument. These SyntheticEvent objects are not valid Convex values. Try wrapping the function like \`const handler = () => myMutation();\` and using \`handler\` in the event handler.`
    );
  }
}

// node_modules/convex/dist/esm/react/queries_observer.js
var __defProp5 = Object.defineProperty;
var __defNormalProp4 = (obj, key, value) => key in obj ? __defProp5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField4 = (obj, key, value) => __defNormalProp4(obj, typeof key !== "symbol" ? key + "" : key, value);
var QueriesObserver = class {
  constructor(createWatch) {
    __publicField4(this, "createWatch");
    __publicField4(this, "queries");
    __publicField4(this, "listeners");
    this.createWatch = createWatch;
    this.queries = {};
    this.listeners = /* @__PURE__ */ new Set();
  }
  setQueries(newQueries) {
    for (const identifier of Object.keys(newQueries)) {
      const { query, args, paginationOptions } = newQueries[identifier];
      getFunctionName(query);
      if (this.queries[identifier] === void 0) {
        this.addQuery(
          identifier,
          query,
          args,
          paginationOptions ? { paginationOptions } : {}
        );
      } else {
        const existingInfo = this.queries[identifier];
        if (getFunctionName(query) !== getFunctionName(existingInfo.query) || JSON.stringify(convexToJson(args)) !== JSON.stringify(convexToJson(existingInfo.args)) || JSON.stringify(paginationOptions) !== JSON.stringify(existingInfo.paginationOptions)) {
          this.removeQuery(identifier);
          this.addQuery(
            identifier,
            query,
            args,
            paginationOptions ? { paginationOptions } : {}
          );
        }
      }
    }
    for (const identifier of Object.keys(this.queries)) {
      if (newQueries[identifier] === void 0) {
        this.removeQuery(identifier);
      }
    }
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  getLocalResults(queries) {
    const result = {};
    for (const identifier of Object.keys(queries)) {
      const { query, args } = queries[identifier];
      const paginationOptions = queries[identifier].paginationOptions;
      getFunctionName(query);
      const watch = this.createWatch(
        query,
        args,
        paginationOptions ? { paginationOptions } : {}
      );
      let value;
      try {
        value = watch.localQueryResult();
      } catch (e2) {
        if (e2 instanceof Error) {
          value = e2;
        } else {
          throw e2;
        }
      }
      result[identifier] = value;
    }
    return result;
  }
  setCreateWatch(createWatch) {
    this.createWatch = createWatch;
    for (const identifier of Object.keys(this.queries)) {
      const { query, args, watch, paginationOptions } = this.queries[identifier];
      const journal = "journal" in watch ? watch.journal() : void 0;
      this.removeQuery(identifier);
      this.addQuery(identifier, query, args, {
        ...journal ? { journal } : [],
        ...paginationOptions ? { paginationOptions } : {}
      });
    }
  }
  destroy() {
    for (const identifier of Object.keys(this.queries)) {
      this.removeQuery(identifier);
    }
    this.listeners = /* @__PURE__ */ new Set();
  }
  addQuery(identifier, query, args, {
    paginationOptions,
    journal
  }) {
    if (this.queries[identifier] !== void 0) {
      throw new Error(
        `Tried to add a new query with identifier ${identifier} when it already exists.`
      );
    }
    const watch = this.createWatch(query, args, {
      ...journal ? { journal } : [],
      ...paginationOptions ? { paginationOptions } : {}
    });
    const unsubscribe = watch.onUpdate(() => this.notifyListeners());
    this.queries[identifier] = {
      query,
      args,
      watch,
      unsubscribe,
      ...paginationOptions ? { paginationOptions } : {}
    };
  }
  removeQuery(identifier) {
    const info = this.queries[identifier];
    if (info === void 0) {
      throw new Error(`No query found with identifier ${identifier}.`);
    }
    info.unsubscribe();
    delete this.queries[identifier];
  }
  notifyListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  }
};

// node_modules/convex/dist/esm/react/use_queries.js
function useQueries(queries) {
  const convex = useConvex();
  if (convex === void 0) {
    throw new Error(
      "Could not find Convex client! `useQuery` must be used in the React component tree under `ConvexProvider`. Did you forget it? See https://docs.convex.dev/quick-start#set-up-convex-in-your-react-app"
    );
  }
  const createWatch = (0, import_react3.useMemo)(() => {
    return (query, args, {
      journal,
      paginationOptions
    }) => {
      if (paginationOptions) {
        return convex.watchPaginatedQuery(query, args, paginationOptions);
      } else {
        return convex.watchQuery(query, args, journal ? { journal } : {});
      }
    };
  }, [convex]);
  return useQueriesHelper(queries, createWatch);
}
function useQueriesHelper(queries, createWatch) {
  const [observer] = (0, import_react3.useState)(() => new QueriesObserver(createWatch));
  if (observer.createWatch !== createWatch) {
    observer.setCreateWatch(createWatch);
  }
  (0, import_react3.useEffect)(() => () => observer.destroy(), [observer]);
  const subscription = (0, import_react3.useMemo)(
    () => ({
      getCurrentValue: () => {
        return observer.getLocalResults(queries);
      },
      subscribe: (callback) => {
        observer.setQueries(queries);
        return observer.subscribe(callback);
      }
    }),
    [observer, queries]
  );
  return useSubscription(subscription);
}

// node_modules/convex/dist/esm/react/use_paginated_query.js
var includePage = Symbol("includePageKeys");
var page = Symbol("page");

// node_modules/convex/dist/esm/react/use_paginated_query2.js
var import_react5 = __toESM(require_react(), 1);

// node_modules/convex/dist/esm/react/auth_helpers.js
var import_react7 = __toESM(require_react(), 1);

// node_modules/convex/dist/esm/react/ConvexAuthState.js
var import_react6 = __toESM(require_react(), 1);
var ConvexAuthContext = (0, import_react6.createContext)(void 0);

// node_modules/convex/dist/esm/react/hydration.js
var import_react8 = __toESM(require_react(), 1);

// node_modules/convex/dist/esm/server/pagination.js
var paginationOptsValidator = v.object({
  numItems: v.number(),
  cursor: v.union(v.string(), v.null()),
  endCursor: v.optional(v.union(v.string(), v.null())),
  id: v.optional(v.number()),
  maximumRowsRead: v.optional(v.number()),
  maximumBytesRead: v.optional(v.number())
});

// node_modules/convex/dist/esm/server/components/index.js
function createChildComponents(root, pathParts) {
  const handler = {
    get(_2, prop) {
      if (typeof prop === "string") {
        const newParts = [...pathParts, prop];
        return createChildComponents(root, newParts);
      } else if (prop === toReferencePath) {
        if (pathParts.length < 1) {
          const found = [root, ...pathParts].join(".");
          throw new Error(
            `API path is expected to be of the form \`${root}.childComponent.functionName\`. Found: \`${found}\``
          );
        }
        return `_reference/childComponent/` + pathParts.join("/");
      } else {
        return void 0;
      }
    }
  };
  return new Proxy({}, handler);
}
var componentsGeneric = () => createChildComponents("components", []);

// node_modules/convex/dist/esm/server/logVars.js
var REQUEST_ID = Symbol("var.requestId");
var IP = Symbol("var.ip");
var USER_AGENT = Symbol("var.userAgent");
var NOW = Symbol("var.now");
var varNames = {
  [REQUEST_ID]: "requestId",
  [IP]: "ip",
  [USER_AGENT]: "userAgent",
  [NOW]: "now"
};

// node_modules/convex/dist/esm/server/schema.js
var __defProp6 = Object.defineProperty;
var __defNormalProp5 = (obj, key, value) => key in obj ? __defProp6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField5 = (obj, key, value) => __defNormalProp5(obj, typeof key !== "symbol" ? key + "" : key, value);
var TableDefinition = class {
  /**
   * @internal
   */
  constructor(documentType) {
    __publicField5(this, "indexes");
    __publicField5(this, "stagedDbIndexes");
    __publicField5(this, "searchIndexes");
    __publicField5(this, "stagedSearchIndexes");
    __publicField5(this, "vectorIndexes");
    __publicField5(this, "stagedVectorIndexes");
    __publicField5(this, "validator");
    this.indexes = [];
    this.stagedDbIndexes = [];
    this.searchIndexes = [];
    this.stagedSearchIndexes = [];
    this.vectorIndexes = [];
    this.stagedVectorIndexes = [];
    this.validator = documentType;
  }
  /**
   * This API is experimental: it may change or disappear.
   *
   * Returns indexes defined on this table.
   * Intended for the advanced use cases of dynamically deciding which index to use for a query.
   * If you think you need this, please chime in on ths issue in the Convex JS GitHub repo.
   * https://github.com/get-convex/convex-js/issues/49
   */
  " indexes"() {
    return this.indexes;
  }
  index(name, indexConfig) {
    if (Array.isArray(indexConfig)) {
      this.indexes.push({
        indexDescriptor: name,
        fields: indexConfig
      });
    } else if (indexConfig.staged) {
      this.stagedDbIndexes.push({
        indexDescriptor: name,
        fields: indexConfig.fields
      });
    } else {
      this.indexes.push({
        indexDescriptor: name,
        fields: indexConfig.fields
      });
    }
    return this;
  }
  searchIndex(name, indexConfig) {
    if (indexConfig.staged) {
      this.stagedSearchIndexes.push({
        indexDescriptor: name,
        searchField: indexConfig.searchField,
        filterFields: indexConfig.filterFields || []
      });
    } else {
      this.searchIndexes.push({
        indexDescriptor: name,
        searchField: indexConfig.searchField,
        filterFields: indexConfig.filterFields || []
      });
    }
    return this;
  }
  vectorIndex(name, indexConfig) {
    if (indexConfig.staged) {
      this.stagedVectorIndexes.push({
        indexDescriptor: name,
        vectorField: indexConfig.vectorField,
        dimensions: indexConfig.dimensions,
        filterFields: indexConfig.filterFields || []
      });
    } else {
      this.vectorIndexes.push({
        indexDescriptor: name,
        vectorField: indexConfig.vectorField,
        dimensions: indexConfig.dimensions,
        filterFields: indexConfig.filterFields || []
      });
    }
    return this;
  }
  /**
   * Work around for https://github.com/microsoft/TypeScript/issues/57035
   */
  self() {
    return this;
  }
  /**
   * Export the contents of this definition.
   *
   * This is called internally by the Convex framework.
   * @internal
   */
  export() {
    const documentType = this.validator.json;
    if (typeof documentType !== "object") {
      throw new Error(
        "Invalid validator: please make sure that the parameter of `defineTable` is valid (see https://docs.convex.dev/database/schemas)"
      );
    }
    return {
      indexes: this.indexes,
      stagedDbIndexes: this.stagedDbIndexes,
      searchIndexes: this.searchIndexes,
      stagedSearchIndexes: this.stagedSearchIndexes,
      vectorIndexes: this.vectorIndexes,
      stagedVectorIndexes: this.stagedVectorIndexes,
      documentType
    };
  }
};
function defineTable(documentSchema) {
  if (isValidator(documentSchema)) {
    return new TableDefinition(documentSchema);
  } else {
    return new TableDefinition(v.object(documentSchema));
  }
}
var SchemaDefinition = class {
  /**
   * @internal
   */
  constructor(tables, options) {
    __publicField5(this, "tables");
    __publicField5(this, "strictTableNameTypes");
    __publicField5(this, "schemaValidation");
    this.tables = tables;
    this.schemaValidation = options?.schemaValidation === void 0 ? true : options.schemaValidation;
  }
  /**
   * Export the contents of this definition.
   *
   * This is called internally by the Convex framework.
   * @internal
   */
  export() {
    return JSON.stringify({
      tables: Object.entries(this.tables).map(([tableName, definition]) => {
        const {
          indexes,
          stagedDbIndexes,
          searchIndexes,
          stagedSearchIndexes,
          vectorIndexes,
          stagedVectorIndexes,
          documentType
        } = definition.export();
        return {
          tableName,
          indexes,
          stagedDbIndexes,
          searchIndexes,
          stagedSearchIndexes,
          vectorIndexes,
          stagedVectorIndexes,
          documentType
        };
      }),
      schemaValidation: this.schemaValidation
    });
  }
};
function defineSchema(schema, options) {
  return new SchemaDefinition(schema, options);
}
var _systemSchema = defineSchema({
  _scheduled_functions: defineTable({
    name: v.string(),
    args: v.array(v.any()),
    scheduledTime: v.float64(),
    completedTime: v.optional(v.float64()),
    state: v.union(
      v.object({ kind: v.literal("pending") }),
      v.object({ kind: v.literal("inProgress") }),
      v.object({ kind: v.literal("success") }),
      v.object({ kind: v.literal("failed"), error: v.string() }),
      v.object({ kind: v.literal("canceled") })
    )
  }),
  _storage: defineTable({
    sha256: v.string(),
    size: v.float64(),
    contentType: v.optional(v.string())
  })
});

// convex/_generated/api.js
var api = anyApi;
var components = componentsGeneric();

// node_modules/react-hot-toast/dist/index.mjs
var import_react9 = __toESM(require_react(), 1);
var import_react10 = __toESM(require_react(), 1);
var y = __toESM(require_react(), 1);

// node_modules/goober/dist/goober.modern.js
var e = { data: "" };
var t = (t2) => {
  if ("object" == typeof window) {
    let e2 = (t2 ? t2.querySelector("#_goober") : window._goober) || Object.assign(document.createElement("style"), { innerHTML: " ", id: "_goober" });
    return e2.nonce = window.__nonce__, e2.parentNode || (t2 || document.head).appendChild(e2), e2.firstChild;
  }
  return t2 || e;
};
var l = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
var a = /\/\*[^]*?\*\/|  +/g;
var n = /\n+/g;
var o = (e2, t2) => {
  let r = "", l2 = "", a2 = "";
  for (let n3 in e2) {
    let c2 = e2[n3];
    "@" == n3[0] ? "i" == n3[1] ? r = n3 + " " + c2 + ";" : l2 += "f" == n3[1] ? o(c2, n3) : n3 + "{" + o(c2, "k" == n3[1] ? "" : t2) + "}" : "object" == typeof c2 ? l2 += o(c2, t2 ? t2.replace(/([^,])+/g, (e3) => n3.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, (t3) => /&/.test(t3) ? t3.replace(/&/g, e3) : e3 ? e3 + " " + t3 : t3)) : n3) : null != c2 && (n3 = /^--/.test(n3) ? n3 : n3.replace(/[A-Z]/g, "-$&").toLowerCase(), a2 += o.p ? o.p(n3, c2) : n3 + ":" + c2 + ";");
  }
  return r + (t2 && a2 ? t2 + "{" + a2 + "}" : a2) + l2;
};
var c = {};
var s = (e2) => {
  if ("object" == typeof e2) {
    let t2 = "";
    for (let r in e2) t2 += r + s(e2[r]);
    return t2;
  }
  return e2;
};
var i = (e2, t2, r, i2, p2) => {
  let u2 = s(e2), d2 = c[u2] || (c[u2] = ((e3) => {
    let t3 = 0, r2 = 11;
    for (; t3 < e3.length; ) r2 = 101 * r2 + e3.charCodeAt(t3++) >>> 0;
    return "go" + r2;
  })(u2));
  if (!c[d2]) {
    let t3 = u2 !== e2 ? e2 : ((e3) => {
      let t4, r2, o2 = [{}];
      for (; t4 = l.exec(e3.replace(a, "")); ) t4[4] ? o2.shift() : t4[3] ? (r2 = t4[3].replace(n, " ").trim(), o2.unshift(o2[0][r2] = o2[0][r2] || {})) : o2[0][t4[1]] = t4[2].replace(n, " ").trim();
      return o2[0];
    })(e2);
    c[d2] = o(p2 ? { ["@keyframes " + d2]: t3 } : t3, r ? "" : "." + d2);
  }
  let f4 = r && c.g ? c.g : null;
  return r && (c.g = c[d2]), ((e3, t3, r2, l2) => {
    l2 ? t3.data = t3.data.replace(l2, e3) : -1 === t3.data.indexOf(e3) && (t3.data = r2 ? e3 + t3.data : t3.data + e3);
  })(c[d2], t2, i2, f4), d2;
};
var p = (e2, t2, r) => e2.reduce((e3, l2, a2) => {
  let n3 = t2[a2];
  if (n3 && n3.call) {
    let e4 = n3(r), t3 = e4 && e4.props && e4.props.className || /^go/.test(e4) && e4;
    n3 = t3 ? "." + t3 : e4 && "object" == typeof e4 ? e4.props ? "" : o(e4, "") : false === e4 ? "" : e4;
  }
  return e3 + l2 + (null == n3 ? "" : n3);
}, "");
function u(e2) {
  let r = this || {}, l2 = e2.call ? e2(r.p) : e2;
  return i(l2.unshift ? l2.raw ? p(l2, [].slice.call(arguments, 1), r.p) : l2.reduce((e3, t2) => Object.assign(e3, t2 && t2.call ? t2(r.p) : t2), {}) : l2, t(r.target), r.g, r.o, r.k);
}
var d;
var f;
var g;
var b = u.bind({ g: 1 });
var h = u.bind({ k: 1 });
function m(e2, t2, r, l2) {
  o.p = t2, d = e2, f = r, g = l2;
}
function w(e2, t2) {
  let r = this || {};
  return function() {
    let l2 = arguments;
    function a2(n3, o2) {
      let c2 = Object.assign({}, n3), s2 = c2.className || a2.className;
      r.p = Object.assign({ theme: f && f() }, c2), r.o = / *go\d+/.test(s2), c2.className = u.apply(r, l2) + (s2 ? " " + s2 : ""), t2 && (c2.ref = o2);
      let i2 = e2;
      return e2[0] && (i2 = c2.as || e2, delete c2.as), g && i2[0] && g(c2), d(i2, c2);
    }
    return t2 ? t2(a2) : a2;
  };
}

// node_modules/react-hot-toast/dist/index.mjs
var b2 = __toESM(require_react(), 1);
var x = __toESM(require_react(), 1);
var Z = (e2) => typeof e2 == "function";
var h2 = (e2, t2) => Z(e2) ? e2(t2) : e2;
var W = /* @__PURE__ */ (() => {
  let e2 = 0;
  return () => (++e2).toString();
})();
var E = /* @__PURE__ */ (() => {
  let e2;
  return () => {
    if (e2 === void 0 && typeof window < "u") {
      let t2 = matchMedia("(prefers-reduced-motion: reduce)");
      e2 = !t2 || t2.matches;
    }
    return e2;
  };
})();
var re = 20;
var k = "default";
var H = (e2, t2) => {
  let { toastLimit: o2 } = e2.settings;
  switch (t2.type) {
    case 0:
      return { ...e2, toasts: [t2.toast, ...e2.toasts].slice(0, o2) };
    case 1:
      return { ...e2, toasts: e2.toasts.map((r) => r.id === t2.toast.id ? { ...r, ...t2.toast } : r) };
    case 2:
      let { toast: s2 } = t2;
      return H(e2, { type: e2.toasts.find((r) => r.id === s2.id) ? 1 : 0, toast: s2 });
    case 3:
      let { toastId: a2 } = t2;
      return { ...e2, toasts: e2.toasts.map((r) => r.id === a2 || a2 === void 0 ? { ...r, dismissed: true, visible: false } : r) };
    case 4:
      return t2.toastId === void 0 ? { ...e2, toasts: [] } : { ...e2, toasts: e2.toasts.filter((r) => r.id !== t2.toastId) };
    case 5:
      return { ...e2, pausedAt: t2.time };
    case 6:
      let i2 = t2.time - (e2.pausedAt || 0);
      return { ...e2, pausedAt: void 0, toasts: e2.toasts.map((r) => ({ ...r, pauseDuration: r.pauseDuration + i2 })) };
  }
};
var v2 = [];
var j = { toasts: [], pausedAt: void 0, settings: { toastLimit: re } };
var f2 = {};
var Y = (e2, t2 = k) => {
  f2[t2] = H(f2[t2] || j, e2), v2.forEach(([o2, s2]) => {
    o2 === t2 && s2(f2[t2]);
  });
};
var _ = (e2) => Object.keys(f2).forEach((t2) => Y(e2, t2));
var Q = (e2) => Object.keys(f2).find((t2) => f2[t2].toasts.some((o2) => o2.id === e2));
var S = (e2 = k) => (t2) => {
  Y(t2, e2);
};
var se = { blank: 4e3, error: 4e3, success: 2e3, loading: 1 / 0, custom: 4e3 };
var ie = (e2, t2 = "blank", o2) => ({ createdAt: Date.now(), visible: true, dismissed: false, type: t2, ariaProps: { role: "status", "aria-live": "polite" }, message: e2, pauseDuration: 0, ...o2, id: (o2 == null ? void 0 : o2.id) || W() });
var P = (e2) => (t2, o2) => {
  let s2 = ie(t2, e2, o2);
  return S(s2.toasterId || Q(s2.id))({ type: 2, toast: s2 }), s2.id;
};
var n2 = (e2, t2) => P("blank")(e2, t2);
n2.error = P("error");
n2.success = P("success");
n2.loading = P("loading");
n2.custom = P("custom");
n2.dismiss = (e2, t2) => {
  let o2 = { type: 3, toastId: e2 };
  t2 ? S(t2)(o2) : _(o2);
};
n2.dismissAll = (e2) => n2.dismiss(void 0, e2);
n2.remove = (e2, t2) => {
  let o2 = { type: 4, toastId: e2 };
  t2 ? S(t2)(o2) : _(o2);
};
n2.removeAll = (e2) => n2.remove(void 0, e2);
n2.promise = (e2, t2, o2) => {
  let s2 = n2.loading(t2.loading, { ...o2, ...o2 == null ? void 0 : o2.loading });
  return typeof e2 == "function" && (e2 = e2()), e2.then((a2) => {
    let i2 = t2.success ? h2(t2.success, a2) : void 0;
    return i2 ? n2.success(i2, { id: s2, ...o2, ...o2 == null ? void 0 : o2.success }) : n2.dismiss(s2), a2;
  }).catch((a2) => {
    let i2 = t2.error ? h2(t2.error, a2) : void 0;
    i2 ? n2.error(i2, { id: s2, ...o2, ...o2 == null ? void 0 : o2.error }) : n2.dismiss(s2);
  }), e2;
};
var de = h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`;
var me = h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`;
var le = h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`;
var C = w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e2) => e2.primary || "#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${de} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${me} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${(e2) => e2.secondary || "#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${le} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;
var Te = h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
var F = w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${(e2) => e2.secondary || "#e0e0e0"};
  border-right-color: ${(e2) => e2.primary || "#616161"};
  animation: ${Te} 1s linear infinite;
`;
var ge = h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`;
var he = h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`;
var L = w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e2) => e2.primary || "#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ge} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${he} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${(e2) => e2.secondary || "#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`;
var be = w("div")`
  position: absolute;
`;
var Se = w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`;
var Ae = h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`;
var Pe = w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ae} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`;
var $ = ({ toast: e2 }) => {
  let { icon: t2, type: o2, iconTheme: s2 } = e2;
  return t2 !== void 0 ? typeof t2 == "string" ? b2.createElement(Pe, null, t2) : t2 : o2 === "blank" ? null : b2.createElement(Se, null, b2.createElement(F, { ...s2 }), o2 !== "loading" && b2.createElement(be, null, o2 === "error" ? b2.createElement(C, { ...s2 }) : b2.createElement(L, { ...s2 })));
};
var Re = (e2) => `
0% {transform: translate3d(0,${e2 * -200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`;
var Ee = (e2) => `
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e2 * -150}%,-1px) scale(.6); opacity:0;}
`;
var ve = "0%{opacity:0;} 100%{opacity:1;}";
var De = "0%{opacity:1;} 100%{opacity:0;}";
var Oe = w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`;
var Ie = w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;
var ke = (e2, t2) => {
  let s2 = e2.includes("top") ? 1 : -1, [a2, i2] = E() ? [ve, De] : [Re(s2), Ee(s2)];
  return { animation: t2 ? `${h(a2)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards` : `${h(i2)} 0.4s forwards cubic-bezier(.06,.71,.55,1)` };
};
var N = y.memo(({ toast: e2, position: t2, style: o2, children: s2 }) => {
  let a2 = e2.height ? ke(e2.position || t2 || "top-center", e2.visible) : { opacity: 0 }, i2 = y.createElement($, { toast: e2 }), r = y.createElement(Ie, { ...e2.ariaProps }, h2(e2.message, e2));
  return y.createElement(Oe, { className: e2.className, style: { ...a2, ...o2, ...e2.style } }, typeof s2 == "function" ? s2({ icon: i2, message: r }) : y.createElement(y.Fragment, null, i2, r));
});
m(x.createElement);
var Ce = u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;

// src/components/AdminProductsManagement.tsx
var import_react13 = __toESM(require_react(), 1);

// node_modules/lucide-react/dist/esm/createLucideIcon.js
var import_react12 = __toESM(require_react());

// node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

// node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.js
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

// node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.js
var toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);

// node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.js
var toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};

// node_modules/lucide-react/dist/esm/Icon.js
var import_react11 = __toESM(require_react());

// node_modules/lucide-react/dist/esm/defaultAttributes.js
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

// node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.js
var hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};

// node_modules/lucide-react/dist/esm/Icon.js
var Icon = (0, import_react11.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => (0, import_react11.createElement)(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => (0, import_react11.createElement)(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);

// node_modules/lucide-react/dist/esm/createLucideIcon.js
var createLucideIcon = (iconName, iconNode) => {
  const Component4 = (0, import_react12.forwardRef)(
    ({ className, ...props }, ref) => (0, import_react12.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component4.displayName = toPascalCase(iconName);
  return Component4;
};

// node_modules/lucide-react/dist/esm/icons/activity.js
var __iconNode = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
var Activity = createLucideIcon("activity", __iconNode);

// node_modules/lucide-react/dist/esm/icons/arrow-down-right.js
var __iconNode2 = [
  ["path", { d: "m7 7 10 10", key: "1fmybs" }],
  ["path", { d: "M17 7v10H7", key: "6fjiku" }]
];
var ArrowDownRight = createLucideIcon("arrow-down-right", __iconNode2);

// node_modules/lucide-react/dist/esm/icons/arrow-right.js
var __iconNode3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
var ArrowRight = createLucideIcon("arrow-right", __iconNode3);

// node_modules/lucide-react/dist/esm/icons/arrow-up-right.js
var __iconNode4 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
var ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode4);

// node_modules/lucide-react/dist/esm/icons/bell.js
var __iconNode5 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
var Bell = createLucideIcon("bell", __iconNode5);

// node_modules/lucide-react/dist/esm/icons/calendar.js
var __iconNode6 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
var Calendar = createLucideIcon("calendar", __iconNode6);

// node_modules/lucide-react/dist/esm/icons/chart-column.js
var __iconNode7 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
var ChartColumn = createLucideIcon("chart-column", __iconNode7);

// node_modules/lucide-react/dist/esm/icons/circle-alert.js
var __iconNode8 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
var CircleAlert = createLucideIcon("circle-alert", __iconNode8);

// node_modules/lucide-react/dist/esm/icons/circle-check-big.js
var __iconNode9 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
var CircleCheckBig = createLucideIcon("circle-check-big", __iconNode9);

// node_modules/lucide-react/dist/esm/icons/circle-x.js
var __iconNode10 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
var CircleX = createLucideIcon("circle-x", __iconNode10);

// node_modules/lucide-react/dist/esm/icons/clock.js
var __iconNode11 = [
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
var Clock = createLucideIcon("clock", __iconNode11);

// node_modules/lucide-react/dist/esm/icons/credit-card.js
var __iconNode12 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
var CreditCard = createLucideIcon("credit-card", __iconNode12);

// node_modules/lucide-react/dist/esm/icons/crown.js
var __iconNode13 = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
var Crown = createLucideIcon("crown", __iconNode13);

// node_modules/lucide-react/dist/esm/icons/database.js
var __iconNode14 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
var Database = createLucideIcon("database", __iconNode14);

// node_modules/lucide-react/dist/esm/icons/dollar-sign.js
var __iconNode15 = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
var DollarSign = createLucideIcon("dollar-sign", __iconNode15);

// node_modules/lucide-react/dist/esm/icons/download.js
var __iconNode16 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
var Download = createLucideIcon("download", __iconNode16);

// node_modules/lucide-react/dist/esm/icons/eye-off.js
var __iconNode17 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
var EyeOff = createLucideIcon("eye-off", __iconNode17);

// node_modules/lucide-react/dist/esm/icons/eye.js
var __iconNode18 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
var Eye = createLucideIcon("eye", __iconNode18);

// node_modules/lucide-react/dist/esm/icons/file-text.js
var __iconNode19 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
var FileText = createLucideIcon("file-text", __iconNode19);

// node_modules/lucide-react/dist/esm/icons/globe.js
var __iconNode20 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
var Globe = createLucideIcon("globe", __iconNode20);

// node_modules/lucide-react/dist/esm/icons/house.js
var __iconNode21 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "r6nss1"
    }
  ]
];
var House = createLucideIcon("house", __iconNode21);

// node_modules/lucide-react/dist/esm/icons/info.js
var __iconNode22 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
var Info = createLucideIcon("info", __iconNode22);

// node_modules/lucide-react/dist/esm/icons/key.js
var __iconNode23 = [
  ["path", { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4", key: "g0fldk" }],
  ["path", { d: "m21 2-9.6 9.6", key: "1j0ho8" }],
  ["circle", { cx: "7.5", cy: "15.5", r: "5.5", key: "yqb3hr" }]
];
var Key = createLucideIcon("key", __iconNode23);

// node_modules/lucide-react/dist/esm/icons/layout-dashboard.js
var __iconNode24 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
var LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode24);

// node_modules/lucide-react/dist/esm/icons/loader-circle.js
var __iconNode25 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
var LoaderCircle = createLucideIcon("loader-circle", __iconNode25);

// node_modules/lucide-react/dist/esm/icons/lock.js
var __iconNode26 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
var Lock = createLucideIcon("lock", __iconNode26);

// node_modules/lucide-react/dist/esm/icons/log-out.js
var __iconNode27 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
var LogOut = createLucideIcon("log-out", __iconNode27);

// node_modules/lucide-react/dist/esm/icons/mail.js
var __iconNode28 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
var Mail = createLucideIcon("mail", __iconNode28);

// node_modules/lucide-react/dist/esm/icons/map-pin.js
var __iconNode29 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
var MapPin = createLucideIcon("map-pin", __iconNode29);

// node_modules/lucide-react/dist/esm/icons/package.js
var __iconNode30 = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
var Package = createLucideIcon("package", __iconNode30);

// node_modules/lucide-react/dist/esm/icons/phone.js
var __iconNode31 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
var Phone = createLucideIcon("phone", __iconNode31);

// node_modules/lucide-react/dist/esm/icons/plus.js
var __iconNode32 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
var Plus = createLucideIcon("plus", __iconNode32);

// node_modules/lucide-react/dist/esm/icons/power.js
var __iconNode33 = [
  ["path", { d: "M12 2v10", key: "mnfbl" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
];
var Power = createLucideIcon("power", __iconNode33);

// node_modules/lucide-react/dist/esm/icons/printer.js
var __iconNode34 = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
var Printer = createLucideIcon("printer", __iconNode34);

// node_modules/lucide-react/dist/esm/icons/refresh-cw.js
var __iconNode35 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
var RefreshCw = createLucideIcon("refresh-cw", __iconNode35);

// node_modules/lucide-react/dist/esm/icons/save.js
var __iconNode36 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
var Save = createLucideIcon("save", __iconNode36);

// node_modules/lucide-react/dist/esm/icons/search.js
var __iconNode37 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
var Search = createLucideIcon("search", __iconNode37);

// node_modules/lucide-react/dist/esm/icons/send.js
var __iconNode38 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
var Send = createLucideIcon("send", __iconNode38);

// node_modules/lucide-react/dist/esm/icons/settings.js
var __iconNode39 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
var Settings = createLucideIcon("settings", __iconNode39);

// node_modules/lucide-react/dist/esm/icons/shield.js
var __iconNode40 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
var Shield = createLucideIcon("shield", __iconNode40);

// node_modules/lucide-react/dist/esm/icons/shopping-bag.js
var __iconNode41 = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
  ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
      key: "o988cm"
    }
  ]
];
var ShoppingBag = createLucideIcon("shopping-bag", __iconNode41);

// node_modules/lucide-react/dist/esm/icons/shopping-cart.js
var __iconNode42 = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
var ShoppingCart = createLucideIcon("shopping-cart", __iconNode42);

// node_modules/lucide-react/dist/esm/icons/square-pen.js
var __iconNode43 = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
var SquarePen = createLucideIcon("square-pen", __iconNode43);

// node_modules/lucide-react/dist/esm/icons/star.js
var __iconNode44 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
var Star = createLucideIcon("star", __iconNode44);

// node_modules/lucide-react/dist/esm/icons/store.js
var __iconNode45 = [
  ["path", { d: "M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5", key: "slp6dd" }],
  [
    "path",
    {
      d: "M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",
      key: "o0xfot"
    }
  ],
  ["path", { d: "M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05", key: "wn3emo" }]
];
var Store = createLucideIcon("store", __iconNode45);

// node_modules/lucide-react/dist/esm/icons/tag.js
var __iconNode46 = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
var Tag = createLucideIcon("tag", __iconNode46);

// node_modules/lucide-react/dist/esm/icons/trash-2.js
var __iconNode47 = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
var Trash2 = createLucideIcon("trash-2", __iconNode47);

// node_modules/lucide-react/dist/esm/icons/trending-up.js
var __iconNode48 = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
var TrendingUp = createLucideIcon("trending-up", __iconNode48);

// node_modules/lucide-react/dist/esm/icons/triangle-alert.js
var __iconNode49 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
var TriangleAlert = createLucideIcon("triangle-alert", __iconNode49);

// node_modules/lucide-react/dist/esm/icons/truck.js
var __iconNode50 = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
var Truck = createLucideIcon("truck", __iconNode50);

// node_modules/lucide-react/dist/esm/icons/user-check.js
var __iconNode51 = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
var UserCheck = createLucideIcon("user-check", __iconNode51);

// node_modules/lucide-react/dist/esm/icons/user.js
var __iconNode52 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
var User = createLucideIcon("user", __iconNode52);

// node_modules/lucide-react/dist/esm/icons/users.js
var __iconNode53 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
var Users = createLucideIcon("users", __iconNode53);

// node_modules/lucide-react/dist/esm/icons/wallet.js
var __iconNode54 = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
var Wallet = createLucideIcon("wallet", __iconNode54);

// node_modules/lucide-react/dist/esm/icons/x.js
var __iconNode55 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
var X2 = createLucideIcon("x", __iconNode55);

// src/components/AdminProductsManagement.tsx
function ProductsManagement() {
  const products = useQuery(api.admin.getAllProducts);
  const toggleProduct = useMutation(api.admin.toggleProduct);
  const deleteProduct = useMutation(api.admin.deleteProduct);
  const [searchTerm, setSearchTerm] = (0, import_react13.useState)("");
  const [filterStore, setFilterStore] = (0, import_react13.useState)(null);
  const [filterCategory, setFilterCategory] = (0, import_react13.useState)(null);
  const [filterAvailable, setFilterAvailable] = (0, import_react13.useState)(null);
  const stores = useQuery(api.stores.getActiveStores);
  const categories = (0, import_react13.useMemo)(() => {
    if (!products) return [];
    const cats = [...new Set(products.map((p2) => p2.category))];
    return cats.filter(Boolean);
  }, [products]);
  const filteredProducts = (products || []).filter((p2) => filterStore === null || p2.storeId === filterStore).filter((p2) => filterCategory === null || p2.category === filterCategory).filter((p2) => filterAvailable === null || filterAvailable === "available" && p2.isAvailable || filterAvailable === "unavailable" && !p2.isAvailable).filter(
    (p2) => !searchTerm || p2.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p2.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) || p2.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleToggleProduct = async (productId, currentStatus) => {
    try {
      await toggleProduct({
        productId,
        isAvailable: !currentStatus
      });
      n2.success(!currentStatus ? "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C" : "\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0645\u0646\u062A\u062C");
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u0646\u062A\u062C");
    }
  };
  const handleDeleteProduct = async (productId) => {
    if (!confirm("\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062A\u062C\u061F \u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621 \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646\u0647.")) {
      return;
    }
    try {
      await deleteProduct({ productId });
      n2.success("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0646\u062A\u062C");
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062D\u0630\u0641 \u0627\u0644\u0645\u0646\u062A\u062C");
    }
  };
  return /* @__PURE__ */ import_react13.default.createElement("div", { className: "p-8" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react13.default.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A"), /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-gray-500 mt-1" }, products ? `${products.length} \u0645\u0646\u062A\u062C \u0625\u062C\u0645\u0627\u0644\u064A\u064B\u0627` : "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")), /* @__PURE__ */ import_react13.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react13.default.createElement(ShoppingBag, { className: "w-5 h-5 text-blue-600" })), /* @__PURE__ */ import_react13.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A")), /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, products?.length ?? "\u2014")), /* @__PURE__ */ import_react13.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react13.default.createElement(CircleCheckBig, { className: "w-5 h-5 text-green-600" })), /* @__PURE__ */ import_react13.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629")), /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, products?.filter((p2) => p2.isAvailable).length ?? "\u2014")), /* @__PURE__ */ import_react13.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react13.default.createElement(Store, { className: "w-5 h-5 text-orange-600" })), /* @__PURE__ */ import_react13.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0639\u062F\u062F \u0627\u0644\u0645\u062A\u0627\u062C\u0631")), /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, stores?.length ?? "\u2014")), /* @__PURE__ */ import_react13.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react13.default.createElement(Tag, { className: "w-5 h-5 text-purple-600" })), /* @__PURE__ */ import_react13.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0639\u062F\u062F \u0627\u0644\u0641\u0626\u0627\u062A")), /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, categories.length))), /* @__PURE__ */ import_react13.default.createElement("div", { className: "bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex flex-col lg:flex-row gap-4" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ import_react13.default.createElement(Search, { className: "absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react13.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0628\u062D\u062B \u0628\u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0627\u0644\u0648\u0635\u0641...",
      value: searchTerm,
      onChange: (e2) => setSearchTerm(e2.target.value),
      className: "w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex gap-2 overflow-x-auto" }, /* @__PURE__ */ import_react13.default.createElement(
    "select",
    {
      value: filterStore || "",
      onChange: (e2) => setFilterStore(e2.target.value || null),
      className: "px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
    },
    /* @__PURE__ */ import_react13.default.createElement("option", { value: "" }, "\u0643\u0644 \u0627\u0644\u0645\u062A\u0627\u062C\u0631"),
    stores?.map((store) => /* @__PURE__ */ import_react13.default.createElement("option", { key: store._id, value: store._id }, store.nameAr))
  ), /* @__PURE__ */ import_react13.default.createElement(
    "select",
    {
      value: filterCategory || "",
      onChange: (e2) => setFilterCategory(e2.target.value || null),
      className: "px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
    },
    /* @__PURE__ */ import_react13.default.createElement("option", { value: "" }, "\u0643\u0644 \u0627\u0644\u0641\u0626\u0627\u062A"),
    categories.map((cat) => /* @__PURE__ */ import_react13.default.createElement("option", { key: cat, value: cat }, cat))
  ), /* @__PURE__ */ import_react13.default.createElement(
    "select",
    {
      value: filterAvailable || "",
      onChange: (e2) => setFilterAvailable(e2.target.value || null),
      className: "px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
    },
    /* @__PURE__ */ import_react13.default.createElement("option", { value: "" }, "\u0627\u0644\u062D\u0627\u0644\u0629"),
    /* @__PURE__ */ import_react13.default.createElement("option", { value: "available" }, "\u0645\u062A\u0627\u062D"),
    /* @__PURE__ */ import_react13.default.createElement("option", { value: "unavailable" }, "\u063A\u064A\u0631 \u0645\u062A\u0627\u062D")
  )))), /* @__PURE__ */ import_react13.default.createElement("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react13.default.createElement("table", { className: "w-full" }, /* @__PURE__ */ import_react13.default.createElement("thead", { className: "bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200" }, /* @__PURE__ */ import_react13.default.createElement("tr", null, /* @__PURE__ */ import_react13.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0645\u0646\u062A\u062C"), /* @__PURE__ */ import_react13.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0645\u062A\u062C\u0631"), /* @__PURE__ */ import_react13.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0641\u0626\u0629"), /* @__PURE__ */ import_react13.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0633\u0639\u0631"), /* @__PURE__ */ import_react13.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u062D\u0627\u0644\u0629"), /* @__PURE__ */ import_react13.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0625\u062C\u0631\u0627\u0621\u0627\u062A"))), /* @__PURE__ */ import_react13.default.createElement("tbody", { className: "divide-y divide-gray-100" }, !products ? /* @__PURE__ */ import_react13.default.createElement("tr", null, /* @__PURE__ */ import_react13.default.createElement("td", { colSpan: 6, className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react13.default.createElement(RefreshCw, { className: "w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" }), /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-gray-400" }, "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644..."))) : filteredProducts.length === 0 ? /* @__PURE__ */ import_react13.default.createElement("tr", null, /* @__PURE__ */ import_react13.default.createElement("td", { colSpan: 6, className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react13.default.createElement(ShoppingBag, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-gray-400 font-medium" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0646\u062A\u062C\u0627\u062A"))) : filteredProducts.map((product) => /* @__PURE__ */ import_react13.default.createElement("tr", { key: product._id, className: "hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ import_react13.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "w-12 h-12 bg-gray-100 rounded-lg overflow-hidden" }, product.imageUrl ? /* @__PURE__ */ import_react13.default.createElement("img", { src: product.imageUrl, alt: product.nameAr, className: "w-full h-full object-cover" }) : /* @__PURE__ */ import_react13.default.createElement("div", { className: "w-full h-full flex items-center justify-center bg-gray-200" }, /* @__PURE__ */ import_react13.default.createElement(ShoppingBag, { className: "w-6 h-6 text-gray-400" }))), /* @__PURE__ */ import_react13.default.createElement("div", null, /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-sm font-semibold text-gray-900" }, product.nameAr || product.name), product.descriptionAr && /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-xs text-gray-500 line-clamp-1" }, product.descriptionAr)))), /* @__PURE__ */ import_react13.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react13.default.createElement("span", { className: "text-sm text-gray-600" }, stores?.find((s2) => s2._id === product.storeId)?.nameAr || "\u2014")), /* @__PURE__ */ import_react13.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react13.default.createElement("span", { className: "px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold" }, product.category || "\u2014")), /* @__PURE__ */ import_react13.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "text-sm" }, /* @__PURE__ */ import_react13.default.createElement("p", { className: "font-semibold text-gray-900" }, product.price, " \u062C.\u0645"), product.originalPrice && product.originalPrice > product.price && /* @__PURE__ */ import_react13.default.createElement("p", { className: "text-xs text-gray-500 line-through" }, product.originalPrice, " \u062C.\u0645"))), /* @__PURE__ */ import_react13.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react13.default.createElement("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${product.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}` }, product.isAvailable ? "\u0645\u062A\u0627\u062D" : "\u063A\u064A\u0631 \u0645\u062A\u0627\u062D")), /* @__PURE__ */ import_react13.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react13.default.createElement(
    "button",
    {
      onClick: () => handleToggleProduct(product._id, product.isAvailable),
      className: `text-xs px-2 py-1 rounded-lg font-medium transition-colors ${product.isAvailable ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`
    },
    product.isAvailable ? "\u0625\u064A\u0642\u0627\u0641" : "\u062A\u0641\u0639\u064A\u0644"
  ), /* @__PURE__ */ import_react13.default.createElement(
    "button",
    {
      onClick: () => handleDeleteProduct(product._id),
      className: "text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors"
    },
    "\u062D\u0630\u0641"
  ))))))))));
}

// src/components/AdminNotificationsManagement.tsx
var import_react15 = __toESM(require_react(), 1);
function NotificationsManagement() {
  const notifications = useQuery(api.admin.getAllNotifications);
  const sendNotification = useMutation(api.admin.sendNotification);
  const markAsRead = useMutation(api.admin.markNotificationAsRead);
  const deleteNotification = useMutation(api.admin.deleteNotification);
  const [showCompose, setShowCompose] = (0, import_react15.useState)(false);
  const [searchTerm, setSearchTerm] = (0, import_react15.useState)("");
  const [filterType, setFilterType] = (0, import_react15.useState)(null);
  const [filterStatus, setFilterStatus] = (0, import_react15.useState)(null);
  const [newNotification, setNewNotification] = (0, import_react15.useState)({
    title: "",
    message: "",
    targetRole: "all",
    type: "info"
  });
  const filteredNotifications = (notifications || []).filter((n3) => filterType === null || n3.type === filterType).filter((n3) => filterStatus === null || filterStatus === "read" && n3.isRead || filterStatus === "unread" && !n3.isRead).filter(
    (n3) => !searchTerm || n3.title.toLowerCase().includes(searchTerm.toLowerCase()) || n3.message.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSendNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      n2.error("\u064A\u062C\u0628 \u0625\u062F\u062E\u0627\u0644 \u0639\u0646\u0648\u0627\u0646 \u0648\u0646\u0635 \u0627\u0644\u0625\u0634\u0639\u0627\u0631");
      return;
    }
    try {
      await sendNotification({
        title: newNotification.title,
        message: newNotification.message,
        targetRole: newNotification.targetRole === "all" ? void 0 : newNotification.targetRole,
        type: newNotification.type
      });
      n2.success("\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0639\u0627\u0631 \u0628\u0646\u062C\u0627\u062D");
      setNewNotification({
        title: "",
        message: "",
        targetRole: "all",
        type: "info"
      });
      setShowCompose(false);
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0639\u0627\u0631");
    }
  };
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead({
        notificationId,
        isRead: true
      });
      n2.success("\u062A\u0645 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0625\u0634\u0639\u0627\u0631 \u0643\u0645\u0642\u0631\u0648\u0621");
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0625\u0634\u0639\u0627\u0631");
    }
  };
  const handleDeleteNotification = async (notificationId) => {
    if (!confirm("\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u061F")) {
      return;
    }
    try {
      await deleteNotification({
        notificationId
      });
      n2.success("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0625\u0634\u0639\u0627\u0631");
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062D\u0630\u0641 \u0627\u0644\u0625\u0634\u0639\u0627\u0631");
    }
  };
  const typeLabels = {
    info: "\u0645\u0639\u0644\u0648\u0645\u0627\u062A",
    success: "\u0646\u062C\u0627\u062D",
    warning: "\u062A\u062D\u0630\u064A\u0631",
    error: "\u062E\u0637\u0623"
  };
  const typeColors = {
    info: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700"
  };
  return /* @__PURE__ */ import_react15.default.createElement("div", { className: "p-8" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react15.default.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A"), /* @__PURE__ */ import_react15.default.createElement("p", { className: "text-gray-500 mt-1" }, notifications ? `${notifications.length} \u0625\u0634\u0639\u0627\u0631 \u0625\u062C\u0645\u0627\u0644\u064A\u064B\u0627` : "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")), /* @__PURE__ */ import_react15.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react15.default.createElement(Bell, { className: "w-5 h-5 text-blue-600" })), /* @__PURE__ */ import_react15.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A")), /* @__PURE__ */ import_react15.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, notifications?.length ?? "\u2014")), /* @__PURE__ */ import_react15.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react15.default.createElement(Clock, { className: "w-5 h-5 text-yellow-600" })), /* @__PURE__ */ import_react15.default.createElement("span", { className: "text-sm text-gray-500" }, "\u063A\u064A\u0631 \u0645\u0642\u0631\u0648\u0621\u0629")), /* @__PURE__ */ import_react15.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, notifications?.filter((n3) => !n3.isRead).length ?? "\u2014")), /* @__PURE__ */ import_react15.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react15.default.createElement(CircleCheckBig, { className: "w-5 h-5 text-green-600" })), /* @__PURE__ */ import_react15.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0645\u0642\u0631\u0648\u0621\u0629")), /* @__PURE__ */ import_react15.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, notifications?.filter((n3) => n3.isRead).length ?? "\u2014")), /* @__PURE__ */ import_react15.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react15.default.createElement(Users, { className: "w-5 h-5 text-purple-600" })), /* @__PURE__ */ import_react15.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0645\u0639\u062F\u0644 \u0627\u0644\u0642\u0631\u0627\u0621\u0629")), /* @__PURE__ */ import_react15.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, notifications && notifications.length > 0 ? Math.round(notifications.filter((n3) => n3.isRead).length / notifications.length * 100) : "\u2014", "%"))), /* @__PURE__ */ import_react15.default.createElement("div", { className: "mb-6" }, /* @__PURE__ */ import_react15.default.createElement(
    "button",
    {
      onClick: () => setShowCompose(true),
      className: "px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
    },
    /* @__PURE__ */ import_react15.default.createElement(Send, { className: "w-5 h-5" }),
    "\u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u062C\u062F\u064A\u062F"
  )), showCompose && /* @__PURE__ */ import_react15.default.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "bg-white rounded-2xl p-6 max-w-md w-full" }, /* @__PURE__ */ import_react15.default.createElement("h2", { className: "text-xl font-bold text-gray-900 mb-4" }, "\u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u062C\u062F\u064A\u062F"), /* @__PURE__ */ import_react15.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react15.default.createElement("div", null, /* @__PURE__ */ import_react15.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0639\u0646\u0648\u0627\u0646"), /* @__PURE__ */ import_react15.default.createElement(
    "input",
    {
      type: "text",
      value: newNotification.title,
      onChange: (e2) => setNewNotification({ ...newNotification, title: e2.target.value }),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400",
      placeholder: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0625\u0634\u0639\u0627\u0631"
    }
  )), /* @__PURE__ */ import_react15.default.createElement("div", null, /* @__PURE__ */ import_react15.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0631\u0633\u0627\u0644\u0629"), /* @__PURE__ */ import_react15.default.createElement(
    "textarea",
    {
      value: newNotification.message,
      onChange: (e2) => setNewNotification({ ...newNotification, message: e2.target.value }),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 h-32 resize-none",
      placeholder: "\u0646\u0635 \u0627\u0644\u0625\u0634\u0639\u0627\u0631"
    }
  )), /* @__PURE__ */ import_react15.default.createElement("div", null, /* @__PURE__ */ import_react15.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u062C\u0645\u0647\u0648\u0631 \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641"), /* @__PURE__ */ import_react15.default.createElement(
    "select",
    {
      value: newNotification.targetRole,
      onChange: (e2) => setNewNotification({ ...newNotification, targetRole: e2.target.value }),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    },
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "all" }, "\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "customer" }, "\u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0641\u0642\u0637"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "merchant" }, "\u0627\u0644\u062A\u062C\u0627\u0631 \u0641\u0642\u0637"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "captain" }, "\u0627\u0644\u0643\u0628\u0627\u062A\u0646 \u0641\u0642\u0637"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "admin" }, "\u0627\u0644\u0645\u062F\u064A\u0631\u0648\u0646 \u0641\u0642\u0637")
  )), /* @__PURE__ */ import_react15.default.createElement("div", null, /* @__PURE__ */ import_react15.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0646\u0648\u0639 \u0627\u0644\u0625\u0634\u0639\u0627\u0631"), /* @__PURE__ */ import_react15.default.createElement(
    "select",
    {
      value: newNotification.type,
      onChange: (e2) => setNewNotification({ ...newNotification, type: e2.target.value }),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    },
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "info" }, "\u0645\u0639\u0644\u0648\u0645\u0627\u062A"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "success" }, "\u0646\u062C\u0627\u062D"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "warning" }, "\u062A\u062D\u0630\u064A\u0631"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "error" }, "\u062E\u0637\u0623")
  ))), /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex gap-3 mt-6" }, /* @__PURE__ */ import_react15.default.createElement(
    "button",
    {
      onClick: handleSendNotification,
      className: "flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
    },
    "\u0625\u0631\u0633\u0627\u0644"
  ), /* @__PURE__ */ import_react15.default.createElement(
    "button",
    {
      onClick: () => setShowCompose(false),
      className: "flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
    },
    "\u0625\u0644\u063A\u0627\u0621"
  )))), /* @__PURE__ */ import_react15.default.createElement("div", { className: "bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex flex-col lg:flex-row gap-4" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ import_react15.default.createElement(Search, { className: "absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react15.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A...",
      value: searchTerm,
      onChange: (e2) => setSearchTerm(e2.target.value),
      className: "w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex gap-2 overflow-x-auto" }, /* @__PURE__ */ import_react15.default.createElement(
    "select",
    {
      value: filterType || "",
      onChange: (e2) => setFilterType(e2.target.value || null),
      className: "px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
    },
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "" }, "\u0643\u0644 \u0627\u0644\u0623\u0646\u0648\u0627\u0639"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "info" }, "\u0645\u0639\u0644\u0648\u0645\u0627\u062A"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "success" }, "\u0646\u062C\u0627\u062D"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "warning" }, "\u062A\u062D\u0630\u064A\u0631"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "error" }, "\u062E\u0637\u0623")
  ), /* @__PURE__ */ import_react15.default.createElement(
    "select",
    {
      value: filterStatus || "",
      onChange: (e2) => setFilterStatus(e2.target.value || null),
      className: "px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
    },
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "" }, "\u0627\u0644\u062D\u0627\u0644\u0629"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "read" }, "\u0645\u0642\u0631\u0648\u0621\u0629"),
    /* @__PURE__ */ import_react15.default.createElement("option", { value: "unread" }, "\u063A\u064A\u0631 \u0645\u0642\u0631\u0648\u0621\u0629")
  )))), /* @__PURE__ */ import_react15.default.createElement("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "divide-y divide-gray-100" }, !notifications ? /* @__PURE__ */ import_react15.default.createElement("div", { className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react15.default.createElement(RefreshCw, { className: "w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" }), /* @__PURE__ */ import_react15.default.createElement("p", { className: "text-gray-400" }, "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")) : filteredNotifications.length === 0 ? /* @__PURE__ */ import_react15.default.createElement("div", { className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react15.default.createElement(Bell, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), /* @__PURE__ */ import_react15.default.createElement("p", { className: "text-gray-400 font-medium" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0625\u0634\u0639\u0627\u0631\u0627\u062A")) : filteredNotifications.map((notification) => /* @__PURE__ */ import_react15.default.createElement("div", { key: notification._id, className: "p-6 hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex-1" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: `px-2 py-1 rounded-lg text-xs font-semibold ${typeColors[notification.type]}` }, typeLabels[notification.type]), !notification.isRead && /* @__PURE__ */ import_react15.default.createElement("span", { className: "w-2 h-2 bg-blue-500 rounded-full" })), /* @__PURE__ */ import_react15.default.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-1" }, notification.title), /* @__PURE__ */ import_react15.default.createElement("p", { className: "text-gray-600 mb-2" }, notification.message), /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex items-center gap-4 text-xs text-gray-500" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react15.default.createElement(Calendar, { className: "w-3 h-3" }), new Date(notification.createdAt).toLocaleDateString("ar-EG")), /* @__PURE__ */ import_react15.default.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react15.default.createElement(Clock, { className: "w-3 h-3" }), new Date(notification.createdAt).toLocaleTimeString("ar-EG")), notification.targetRole && /* @__PURE__ */ import_react15.default.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react15.default.createElement(Users, { className: "w-3 h-3" }), notification.targetRole === "customer" ? "\u0627\u0644\u0639\u0645\u0644\u0627\u0621" : notification.targetRole === "merchant" ? "\u0627\u0644\u062A\u062C\u0627\u0631" : notification.targetRole === "captain" ? "\u0627\u0644\u0643\u0628\u0627\u062A\u0646" : notification.targetRole === "admin" ? "\u0627\u0644\u0645\u062F\u064A\u0631\u0648\u0646" : notification.targetRole))), /* @__PURE__ */ import_react15.default.createElement("div", { className: "flex items-center gap-2" }, !notification.isRead && /* @__PURE__ */ import_react15.default.createElement(
    "button",
    {
      onClick: () => handleMarkAsRead(notification._id),
      className: "text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition-colors"
    },
    "\u062A\u062D\u062F\u064A\u062F \u0643\u0645\u0642\u0631\u0648\u0621"
  ), /* @__PURE__ */ import_react15.default.createElement(
    "button",
    {
      onClick: () => handleDeleteNotification(notification._id),
      className: "text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors"
    },
    "\u062D\u0630\u0641"
  ))))))));
}

// src/components/AdminActivityLog.tsx
var import_react17 = __toESM(require_react(), 1);
function ActivityLog() {
  const [searchTerm, setSearchTerm] = (0, import_react17.useState)("");
  const [filterEntityType, setFilterEntityType] = (0, import_react17.useState)(null);
  const [filterStatus, setFilterStatus] = (0, import_react17.useState)(null);
  const [filterDate, setFilterDate] = (0, import_react17.useState)(null);
  const mockActivities = [
    {
      _id: "1",
      userId: "user1",
      userName: "\u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F",
      userRole: "admin",
      action: "\u062D\u0630\u0641 \u0645\u0633\u062A\u062E\u062F\u0645",
      entityType: "user",
      entityName: "\u0645\u062D\u0645\u062F \u0639\u0644\u064A",
      entityId: "user123",
      details: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0633\u0628\u0628 \u0627\u0646\u062A\u0647\u0627\u0643 \u0634\u0631\u0648\u0637 \u0627\u0644\u062E\u062F\u0645\u0629",
      timestamp: Date.now() - 36e5,
      ipAddress: "192.168.1.1",
      status: "success"
    },
    {
      _id: "2",
      userId: "user2",
      userName: "\u0633\u0627\u0631\u0629 \u0623\u062D\u0645\u062F",
      userRole: "merchant",
      action: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062A\u062C",
      entityType: "product",
      entityName: "\u0628\u064A\u062A\u0632\u0627 \u062E\u0627\u0635\u0629",
      entityId: "prod123",
      details: "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062A\u062C \u062C\u062F\u064A\u062F \u0644\u0644\u0645\u062A\u062C\u0631",
      timestamp: Date.now() - 72e5,
      status: "success"
    },
    {
      _id: "3",
      userId: "user3",
      userName: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0646\u0638\u0627\u0645",
      userRole: "admin",
      action: "\u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631",
      entityType: "notification",
      entityName: "\u0625\u0634\u0639\u0627\u0631 \u0635\u064A\u0627\u0646\u0629",
      entityId: "notif123",
      details: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646",
      timestamp: Date.now() - 108e5,
      status: "info"
    }
  ];
  const activities = mockActivities;
  const filteredActivities = (activities || []).filter((a2) => filterEntityType === null || a2.entityType === filterEntityType).filter((a2) => filterStatus === null || a2.status === filterStatus).filter(
    (a2) => !searchTerm || a2.userName.toLowerCase().includes(searchTerm.toLowerCase()) || a2.action.toLowerCase().includes(searchTerm.toLowerCase()) || a2.entityName.toLowerCase().includes(searchTerm.toLowerCase()) || a2.details.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((a2) => {
    if (!filterDate) return true;
    const activityDate = new Date(a2.timestamp).toDateString();
    const filterDateObj = new Date(filterDate).toDateString();
    return activityDate === filterDateObj;
  });
  const entityTypes = [
    { key: null, label: "\u0643\u0644 \u0627\u0644\u0643\u064A\u0627\u0646\u0627\u062A" },
    { key: "user", label: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0648\u0646" },
    { key: "store", label: "\u0627\u0644\u0645\u062A\u0627\u062C\u0631" },
    { key: "product", label: "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" },
    { key: "order", label: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A" },
    { key: "notification", label: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A" },
    { key: "system", label: "\u0627\u0644\u0646\u0638\u0627\u0645" }
  ];
  const statusTypes = [
    { key: null, label: "\u0643\u0644 \u0627\u0644\u062D\u0627\u0644\u0627\u062A" },
    { key: "success", label: "\u0646\u062C\u062D" },
    { key: "failed", label: "\u0641\u0634\u0644" },
    { key: "warning", label: "\u062A\u062D\u0630\u064A\u0631" },
    { key: "info", label: "\u0645\u0639\u0644\u0648\u0645\u0627\u062A" }
  ];
  const getEntityIcon = (type) => {
    switch (type) {
      case "user":
        return /* @__PURE__ */ import_react17.default.createElement(User, { className: "w-4 h-4" });
      case "store":
        return /* @__PURE__ */ import_react17.default.createElement(Store, { className: "w-4 h-4" });
      case "product":
        return /* @__PURE__ */ import_react17.default.createElement(Package, { className: "w-4 h-4" });
      case "order":
        return /* @__PURE__ */ import_react17.default.createElement(Package, { className: "w-4 h-4" });
      case "notification":
        return /* @__PURE__ */ import_react17.default.createElement(Bell, { className: "w-4 h-4" });
      case "system":
        return /* @__PURE__ */ import_react17.default.createElement(Settings, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ import_react17.default.createElement(Activity, { className: "w-4 h-4" });
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return /* @__PURE__ */ import_react17.default.createElement(CircleCheckBig, { className: "w-4 h-4 text-green-500" });
      case "failed":
        return /* @__PURE__ */ import_react17.default.createElement(CircleX, { className: "w-4 h-4 text-red-500" });
      case "warning":
        return /* @__PURE__ */ import_react17.default.createElement(TriangleAlert, { className: "w-4 h-4 text-yellow-500" });
      case "info":
        return /* @__PURE__ */ import_react17.default.createElement(Info, { className: "w-4 h-4 text-blue-500" });
      default:
        return /* @__PURE__ */ import_react17.default.createElement(Activity, { className: "w-4 h-4 text-gray-500" });
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "info":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "\u0645\u062F\u064A\u0631";
      case "merchant":
        return "\u062A\u0627\u062C\u0631";
      case "captain":
        return "\u0643\u0627\u0628\u062A\u0646";
      case "customer":
        return "\u0639\u0645\u064A\u0644";
      default:
        return role;
    }
  };
  return /* @__PURE__ */ import_react17.default.createElement("div", { className: "p-8" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react17.default.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, "\u0633\u062C\u0644 \u0627\u0644\u0646\u0634\u0627\u0637"), /* @__PURE__ */ import_react17.default.createElement("p", { className: "text-gray-500 mt-1" }, activities ? `${activities.length} \u0646\u0634\u0627\u0637 \u0625\u062C\u0645\u0627\u0644\u064A\u064B\u0627` : "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")), /* @__PURE__ */ import_react17.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react17.default.createElement(Activity, { className: "w-5 h-5 text-blue-600" })), /* @__PURE__ */ import_react17.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0646\u0634\u0627\u0637")), /* @__PURE__ */ import_react17.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, activities?.length ?? "\u2014")), /* @__PURE__ */ import_react17.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react17.default.createElement(CircleCheckBig, { className: "w-5 h-5 text-green-600" })), /* @__PURE__ */ import_react17.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0646\u0627\u062C\u062D")), /* @__PURE__ */ import_react17.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, activities?.filter((a2) => a2.status === "success").length ?? "\u2014")), /* @__PURE__ */ import_react17.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react17.default.createElement(CircleX, { className: "w-5 h-5 text-red-600" })), /* @__PURE__ */ import_react17.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0641\u0634\u0644")), /* @__PURE__ */ import_react17.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, activities?.filter((a2) => a2.status === "failed").length ?? "\u2014")), /* @__PURE__ */ import_react17.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react17.default.createElement(TriangleAlert, { className: "w-5 h-5 text-yellow-600" })), /* @__PURE__ */ import_react17.default.createElement("span", { className: "text-sm text-gray-500" }, "\u062A\u062D\u0630\u064A\u0631")), /* @__PURE__ */ import_react17.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, activities?.filter((a2) => a2.status === "warning").length ?? "\u2014"))), /* @__PURE__ */ import_react17.default.createElement("div", { className: "bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex flex-col lg:flex-row gap-4" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ import_react17.default.createElement(Search, { className: "absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react17.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0646\u0634\u0627\u0637...",
      value: searchTerm,
      onChange: (e2) => setSearchTerm(e2.target.value),
      className: "w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex gap-2 overflow-x-auto" }, /* @__PURE__ */ import_react17.default.createElement(
    "select",
    {
      value: filterEntityType || "",
      onChange: (e2) => setFilterEntityType(e2.target.value || null),
      className: "px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
    },
    entityTypes.map(({ key, label }) => /* @__PURE__ */ import_react17.default.createElement("option", { key: String(key), value: key || "" }, label))
  ), /* @__PURE__ */ import_react17.default.createElement(
    "select",
    {
      value: filterStatus || "",
      onChange: (e2) => setFilterStatus(e2.target.value || null),
      className: "px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
    },
    statusTypes.map(({ key, label }) => /* @__PURE__ */ import_react17.default.createElement("option", { key: String(key), value: key || "" }, label))
  ), /* @__PURE__ */ import_react17.default.createElement(
    "input",
    {
      type: "date",
      value: filterDate || "",
      onChange: (e2) => setFilterDate(e2.target.value || null),
      className: "px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-purple-400"
    }
  )))), /* @__PURE__ */ import_react17.default.createElement("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "divide-y divide-gray-100" }, !activities ? /* @__PURE__ */ import_react17.default.createElement("div", { className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react17.default.createElement(RefreshCw, { className: "w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" }), /* @__PURE__ */ import_react17.default.createElement("p", { className: "text-gray-400" }, "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")) : filteredActivities.length === 0 ? /* @__PURE__ */ import_react17.default.createElement("div", { className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react17.default.createElement(Activity, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), /* @__PURE__ */ import_react17.default.createElement("p", { className: "text-gray-400 font-medium" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0646\u0634\u0637\u0629")) : filteredActivities.map((activity) => /* @__PURE__ */ import_react17.default.createElement("div", { key: activity._id, className: "p-6 hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex items-start justify-between gap-4" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex items-start gap-4 flex-1" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0" }, getEntityIcon(activity.entityType)), /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex-1" }, /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react17.default.createElement("span", { className: "font-semibold text-gray-900" }, activity.userName), /* @__PURE__ */ import_react17.default.createElement("span", { className: "px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold" }, getRoleLabel(activity.userRole)), /* @__PURE__ */ import_react17.default.createElement("span", { className: `px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(activity.status)}` }, activity.status)), /* @__PURE__ */ import_react17.default.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-1" }, activity.action), /* @__PURE__ */ import_react17.default.createElement("p", { className: "text-gray-600 mb-2" }, activity.details), /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex items-center gap-4 text-xs text-gray-500" }, /* @__PURE__ */ import_react17.default.createElement("span", { className: "flex items-center gap-1" }, getEntityIcon(activity.entityType), activity.entityName), /* @__PURE__ */ import_react17.default.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react17.default.createElement(Calendar, { className: "w-3 h-3" }), new Date(activity.timestamp).toLocaleDateString("ar-EG")), /* @__PURE__ */ import_react17.default.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react17.default.createElement(Clock, { className: "w-3 h-3" }), new Date(activity.timestamp).toLocaleTimeString("ar-EG")), activity.ipAddress && /* @__PURE__ */ import_react17.default.createElement("span", null, "IP: ", activity.ipAddress)))), /* @__PURE__ */ import_react17.default.createElement("div", { className: "flex items-center gap-2" }, getStatusIcon(activity.status))))))));
}

// src/components/AdminSystemSettings.tsx
var import_react20 = __toESM(require_react(), 1);

// src/lib/allowedSettingsFields.ts
var ALLOWED_SETTINGS_FIELDS = [
  "siteName",
  "siteNameAr",
  "siteDescription",
  "siteDescriptionAr",
  "contactEmail",
  "contactPhone",
  "supportEmail",
  "supportPhone",
  "address",
  "addressAr",
  "logoUrl",
  "faviconUrl",
  "primaryColor",
  "secondaryColor",
  "currency",
  "currencySymbol",
  "language",
  "timezone",
  "maintenanceMode",
  "allowRegistration",
  "emailVerificationRequired",
  "phoneVerificationRequired",
  "requirePhoneVerification",
  "commissionRate",
  "defaultCommissionRate",
  "captainCommissionRate",
  "storeApprovalRequired",
  "captainApprovalRequired",
  "autoAcceptOrders",
  "orderTimeoutMinutes",
  "maxProductsPerStore",
  "enableReviews",
  "enableRatings",
  "enableNotifications",
  "enableEmailNotifications",
  "enableSMSNotifications",
  "enablePushNotifications",
  "minOrderAmount",
  "freeDeliveryThreshold",
  "deliveryFee",
  "taxRate",
  "walletPhone",
  "socialLinks",
  "paymentMethods",
  "deliveryOptions"
];

// src/contexts/SystemSettingsContext.tsx
var import_react18 = __toESM(require_react(), 1);
var SystemSettingsContext = (0, import_react18.createContext)(void 0);
function useSystemSettings() {
  const context = (0, import_react18.useContext)(SystemSettingsContext);
  if (context === void 0) {
    throw new Error("useSystemSettings must be used within a SystemSettingsProvider");
  }
  return context;
}

// src/components/AdminSystemSettings.tsx
function SystemSettings() {
  const { refreshSettings } = useSystemSettings();
  const [settings, setSettings] = (0, import_react20.useState)({
    siteName: "Aqraply",
    siteNameAr: "\u0623\u0642\u0631\u0628\u0644\u064A",
    siteDescription: "Online food delivery platform",
    siteDescriptionAr: "\u0645\u0646\u0635\u0629 \u062A\u0648\u0635\u064A\u0644 \u0637\u0639\u0627\u0645 \u0639\u0628\u0631 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A",
    contactEmail: "support@aqraply.com",
    contactPhone: "+201234567890",
    supportEmail: "support@aqraply.com",
    supportPhone: "+201234567890",
    address: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0645\u0635\u0631",
    addressAr: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0645\u0635\u0631",
    currency: "EGP",
    currencySymbol: "\u062C.\u0645",
    language: "ar",
    timezone: "Africa/Cairo",
    maintenanceMode: false,
    allowRegistration: true,
    emailVerificationRequired: true,
    phoneVerificationRequired: false,
    requirePhoneVerification: false,
    commissionRate: 10,
    defaultCommissionRate: 10,
    captainCommissionRate: 15,
    storeApprovalRequired: true,
    captainApprovalRequired: true,
    autoAcceptOrders: false,
    orderTimeoutMinutes: 15,
    maxProductsPerStore: 100,
    enableReviews: true,
    enableRatings: true,
    enableNotifications: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    minOrderAmount: 50,
    freeDeliveryThreshold: 200,
    deliveryFee: 20,
    taxRate: 14,
    walletPhone: "01012345678",
    socialLinks: {
      facebook: "https://facebook.com/aqraply",
      twitter: "https://twitter.com/aqraply",
      instagram: "https://instagram.com/aqraply",
      linkedin: "https://linkedin.com/aqraply"
    },
    paymentMethods: {
      cash: true,
      card: true,
      wallet: true
    },
    deliveryOptions: {
      standard: true,
      express: true,
      scheduled: false
    }
  });
  const [isLoading, setIsLoading] = (0, import_react20.useState)(false);
  const [activeTab, setActiveTab] = (0, import_react20.useState)("general");
  const [hasUnsavedChanges, setHasUnsavedChanges] = (0, import_react20.useState)(false);
  const [lastSaved, setLastSaved] = (0, import_react20.useState)(null);
  const systemSettings = useQuery(api.systemSettings.getSettings);
  const updateSettings = useMutation(api.systemSettings.updateSettings);
  const resetSettings = useMutation(api.adminExport.resetSystemSettings);
  (0, import_react20.useEffect)(() => {
    console.log("System settings from DB:", systemSettings);
    if (systemSettings) {
      setSettings((prev) => ({
        ...prev,
        ...systemSettings
      }));
    }
  }, [systemSettings]);
  (0, import_react20.useEffect)(() => {
    const handleBeforeUnload = (e2) => {
      if (hasUnsavedChanges) {
        e2.preventDefault();
        e2.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);
  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      console.log("Current settings state:", settings);
      const { _id, _creationTime, ...cleanedSettings } = settings;
      const settingsToSave = {};
      Object.keys(cleanedSettings).forEach((key) => {
        if (ALLOWED_SETTINGS_FIELDS.includes(key)) {
          settingsToSave[key] = cleanedSettings[key];
        }
      });
      console.log("Settings to save:", settingsToSave);
      const result = await updateSettings(settingsToSave);
      console.log("Settings saved successfully:", result);
      setLastSaved(/* @__PURE__ */ new Date());
      setHasUnsavedChanges(false);
      refreshSettings();
      n2.success("\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0628\u0646\u062C\u0627\u062D");
      setTimeout(() => {
        n2("\u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0639\u0644\u0649 \u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0646\u062C\u0627\u062D");
      }, 1e3);
    } catch (error) {
      console.error("Save settings error:", error);
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A");
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setSettings((prev) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value === void 0 ? "" : value
          }
        };
      }
      return {
        ...prev,
        [field]: value === void 0 ? "" : value
      };
    });
    setHasUnsavedChanges(true);
  };
  const handleResetSettings = async () => {
    if (!confirm("\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u062C\u0645\u064A\u0639 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0625\u0644\u0649 \u0627\u0644\u0642\u064A\u0645 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629\u061F")) return;
    setIsLoading(true);
    try {
      await resetSettings();
      setHasUnsavedChanges(false);
      setLastSaved(/* @__PURE__ */ new Date());
      n2.success("\u062A\u0645 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0628\u0646\u062C\u0627\u062D");
      setTimeout(() => {
        window.location.reload();
      }, 1e3);
    } catch (error) {
      console.error("Reset settings error:", error);
      n2.error("\u0641\u0634\u0644 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A");
    } finally {
      setIsLoading(false);
    }
  };
  const tabs = [
    { id: "general", label: "\u0639\u0627\u0645", icon: /* @__PURE__ */ import_react20.default.createElement(Globe, { className: "w-4 h-4" }) },
    { id: "notifications", label: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A", icon: /* @__PURE__ */ import_react20.default.createElement(Bell, { className: "w-4 h-4" }) },
    { id: "security", label: "\u0627\u0644\u0623\u0645\u0627\u0646", icon: /* @__PURE__ */ import_react20.default.createElement(Shield, { className: "w-4 h-4" }) },
    { id: "payments", label: "\u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0627\u062A", icon: /* @__PURE__ */ import_react20.default.createElement(DollarSign, { className: "w-4 h-4" }) },
    { id: "orders", label: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", icon: /* @__PURE__ */ import_react20.default.createElement(Package, { className: "w-4 h-4" }) },
    { id: "users", label: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0648\u0646", icon: /* @__PURE__ */ import_react20.default.createElement(Users, { className: "w-4 h-4" }) },
    { id: "social", label: "\u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A", icon: /* @__PURE__ */ import_react20.default.createElement(Store, { className: "w-4 h-4" }) }
  ];
  return /* @__PURE__ */ import_react20.default.createElement("div", { className: "p-8" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react20.default.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0646\u0638\u0627\u0645"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-gray-500 mt-1" }, "\u0625\u062F\u0627\u0631\u0629 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0648\u062A\u0643\u0648\u064A\u0646\u0627\u062A \u0627\u0644\u0646\u0638\u0627\u0645")), /* @__PURE__ */ import_react20.default.createElement("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "border-b border-gray-200" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex overflow-x-auto" }, tabs.map((tab) => /* @__PURE__ */ import_react20.default.createElement(
    "button",
    {
      key: tab.id,
      onClick: () => setActiveTab(tab.id),
      className: `flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${activeTab === tab.id ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"}`
    },
    tab.icon,
    /* @__PURE__ */ import_react20.default.createElement("span", { className: "font-medium" }, tab.label)
  )))), /* @__PURE__ */ import_react20.default.createElement("div", { className: "p-6" }, activeTab === "general" && /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0642\u0639 (\u0625\u0646\u062C\u0644\u064A\u0632\u064A)"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "text",
      value: settings.siteName,
      onChange: (e2) => handleInputChange("siteName", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0642\u0639 (\u0639\u0631\u0628\u064A)"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "text",
      value: settings.siteNameAr,
      onChange: (e2) => handleInputChange("siteNameAr", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0648\u0635\u0641 \u0627\u0644\u0645\u0648\u0642\u0639 (\u0625\u0646\u062C\u0644\u064A\u0632\u064A)"), /* @__PURE__ */ import_react20.default.createElement(
    "textarea",
    {
      value: settings.siteDescription,
      onChange: (e2) => handleInputChange("siteDescription", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 h-20 resize-none"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0648\u0635\u0641 \u0627\u0644\u0645\u0648\u0642\u0639 (\u0639\u0631\u0628\u064A)"), /* @__PURE__ */ import_react20.default.createElement(
    "textarea",
    {
      value: settings.siteDescriptionAr,
      onChange: (e2) => handleInputChange("siteDescriptionAr", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 h-20 resize-none"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u0644\u062A\u0648\u0627\u0635\u0644"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "email",
      value: settings.contactEmail,
      onChange: (e2) => handleInputChange("contactEmail", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0647\u0627\u062A\u0641 \u0627\u0644\u062A\u0648\u0627\u0635\u0644"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "tel",
      value: settings.contactPhone,
      onChange: (e2) => handleInputChange("contactPhone", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0639\u0646\u0648\u0627\u0646 (\u0625\u0646\u062C\u0644\u064A\u0632\u064A)"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "text",
      value: settings.address,
      onChange: (e2) => handleInputChange("address", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0639\u0646\u0648\u0627\u0646 (\u0639\u0631\u0628\u064A)"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "text",
      value: settings.addressAr,
      onChange: (e2) => handleInputChange("addressAr", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0639\u0645\u0644\u0629"), /* @__PURE__ */ import_react20.default.createElement(
    "select",
    {
      value: settings.currency,
      onChange: (e2) => handleInputChange("currency", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    },
    /* @__PURE__ */ import_react20.default.createElement("option", { value: "EGP" }, "\u062C\u0646\u064A\u0647 \u0645\u0635\u0631\u064A (EGP)"),
    /* @__PURE__ */ import_react20.default.createElement("option", { value: "USD" }, "\u062F\u0648\u0644\u0627\u0631 \u0623\u0645\u0631\u064A\u0643\u064A (USD)"),
    /* @__PURE__ */ import_react20.default.createElement("option", { value: "EUR" }, "\u064A\u0648\u0631\u0648 (EUR)")
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0631\u0645\u0632 \u0627\u0644\u0639\u0645\u0644\u0629"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "text",
      value: settings.currencySymbol,
      onChange: (e2) => handleInputChange("currencySymbol", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629"), /* @__PURE__ */ import_react20.default.createElement(
    "select",
    {
      value: settings.defaultLanguage,
      onChange: (e2) => handleInputChange("defaultLanguage", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    },
    /* @__PURE__ */ import_react20.default.createElement("option", { value: "ar" }, "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"),
    /* @__PURE__ */ import_react20.default.createElement("option", { value: "en" }, "English")
  )))), activeTab === "notifications" && /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react20.default.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-4" }, "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A"), /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Mail, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u062F\u064A\u0629"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0639\u0628\u0631 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.enableEmailNotifications,
      onChange: (e2) => handleInputChange("enableEmailNotifications", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Bell, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A Push"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0641\u0648\u0631\u064A\u0629 \u0644\u0644\u062A\u0637\u0628\u064A\u0642"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.enablePushNotifications,
      onChange: (e2) => handleInputChange("enablePushNotifications", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Phone, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A SMS"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0639\u0628\u0631 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0646\u0635\u064A\u0629"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.enableSMSNotifications,
      onChange: (e2) => handleInputChange("enableSMSNotifications", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  )))), activeTab === "security" && /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react20.default.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-4" }, "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0623\u0645\u0627\u0646"), /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(TriangleAlert, { className: "w-5 h-5 text-yellow-500" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0648\u0636\u0639 \u0627\u0644\u0635\u064A\u0627\u0646\u0629"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0645\u0648\u0642\u0639 \u0645\u0624\u0642\u062A\u0627\u064B \u0644\u0644\u0635\u064A\u0627\u0646\u0629"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.maintenanceMode,
      onChange: (e2) => handleInputChange("maintenanceMode", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Users, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0627\u0644\u0633\u0645\u0627\u062D \u0628\u0627\u0644\u062A\u0633\u062C\u064A\u0644"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u0627\u0644\u0633\u0645\u0627\u062D \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0627\u0644\u062C\u062F\u062F \u0628\u0627\u0644\u062A\u0633\u062C\u064A\u0644"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.allowRegistration,
      onChange: (e2) => handleInputChange("allowRegistration", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Mail, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u0625\u062C\u0628\u0627\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0628\u0631\u064A\u062F\u0647\u0645"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.requireEmailVerification,
      onChange: (e2) => handleInputChange("requireEmailVerification", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Phone, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0647\u0627\u062A\u0641"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u0625\u062C\u0628\u0627\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0647\u0648\u0627\u062A\u0641\u0647\u0645"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.requirePhoneVerification,
      onChange: (e2) => handleInputChange("requirePhoneVerification", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  )))), activeTab === "payments" && /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react20.default.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-4" }, "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0627\u062A"), /* @__PURE__ */ import_react20.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0637\u0644\u0628"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.minOrderAmount,
      onChange: (e2) => handleInputChange("minOrderAmount", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0637\u0644\u0628"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.maxOrderAmount,
      onChange: (e2) => handleInputChange("maxOrderAmount", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0631\u0633\u0648\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.deliveryFee,
      onChange: (e2) => handleInputChange("deliveryFee", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u062D\u062F \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u062C\u0627\u0646\u064A"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.freeDeliveryThreshold,
      onChange: (e2) => handleInputChange("freeDeliveryThreshold", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0646\u0633\u0628\u0629 \u0627\u0644\u0636\u0631\u064A\u0628\u0629 (%)"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.taxRate,
      onChange: (e2) => handleInputChange("taxRate", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0646\u0633\u0628\u0629 \u0627\u0644\u0639\u0645\u0648\u0644\u0629 (%)"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.commissionRate,
      onChange: (e2) => handleInputChange("commissionRate", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0646\u0633\u0628\u0629 \u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0643\u0627\u0628\u062A\u0646 (%)"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.captainCommissionRate,
      onChange: (e2) => handleInputChange("captainCommissionRate", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  ))), /* @__PURE__ */ import_react20.default.createElement("div", { className: "border-t pt-6" }, /* @__PURE__ */ import_react20.default.createElement("h4", { className: "text-md font-semibold text-gray-900 mb-4" }, "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062D\u0641\u0638\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629"), /* @__PURE__ */ import_react20.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0631\u0642\u0645 \u0627\u0644\u0645\u062D\u0641\u0638\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "tel",
      value: settings.walletPhone || "",
      onChange: (e2) => handleInputChange("walletPhone", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400",
      placeholder: "01xxxxxxxxx"
    }
  ), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-xs text-gray-500 mt-1" }, "\u0631\u0642\u0645 \u0627\u0644\u0645\u062D\u0641\u0638\u0629 \u0644\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u062A\u062D\u0648\u064A\u0644\u0627\u062A \u0627\u0644\u0639\u0645\u0644\u0627\u0621")), /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Wallet, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062F\u0641\u0639 \u0628\u0627\u0644\u0645\u062D\u0641\u0638\u0629"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u0627\u0644\u0633\u0645\u0627\u062D \u0644\u0644\u0639\u0645\u0644\u0627\u0621 \u0628\u0627\u0644\u062F\u0641\u0639 \u0639\u0628\u0631 \u0627\u0644\u0645\u062D\u0641\u0638\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.paymentMethods?.wallet || false,
      onChange: (e2) => handleInputChange("paymentMethods.wallet", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  ))))), activeTab === "orders" && /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react20.default.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-4" }, "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0637\u0644\u0628\u0627\u062A"), /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Store, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0645\u0637\u0644\u0648\u0628\u0629"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u064A\u062A\u0637\u0644\u0628 \u0645\u0648\u0627\u0641\u0642\u0629 \u0627\u0644\u0645\u062F\u064A\u0631 \u0644\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.storeApprovalRequired,
      onChange: (e2) => handleInputChange("storeApprovalRequired", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Truck, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0643\u0628\u0627\u062A\u0646 \u0645\u0637\u0644\u0648\u0628\u0629"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u064A\u062A\u0637\u0644\u0628 \u0645\u0648\u0627\u0641\u0642\u0629 \u0627\u0644\u0645\u062F\u064A\u0631 \u0644\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0643\u0628\u0627\u062A\u0646 \u0627\u0644\u062C\u062F\u062F"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.captainApprovalRequired,
      onChange: (e2) => handleInputChange("captainApprovalRequired", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("label", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react20.default.createElement(Package, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "font-medium text-gray-900" }, "\u0642\u0628\u0648\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B"), /* @__PURE__ */ import_react20.default.createElement("p", { className: "text-sm text-gray-500" }, "\u0642\u0628\u0648\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0628\u062F\u0648\u0646 \u0645\u0648\u0627\u0641\u0642\u0629 \u064A\u062F\u0648\u064A\u0629"))), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: settings.autoAcceptOrders,
      onChange: (e2) => handleInputChange("autoAcceptOrders", e2.target.checked),
      className: "w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
    }
  ))), /* @__PURE__ */ import_react20.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-6" }, /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0645\u0647\u0644\u0629 \u0627\u0646\u062A\u0647\u0627\u0621 \u0627\u0644\u0637\u0644\u0628 (\u062F\u0642\u0627\u0626\u0642)"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.orderTimeoutMinutes,
      onChange: (e2) => handleInputChange("orderTimeoutMinutes", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0644\u0644\u0645\u062A\u062C\u0631"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.maxProductsPerStore,
      onChange: (e2) => handleInputChange("maxProductsPerStore", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0645\u062A\u0627\u062C\u0631 \u0644\u0644\u062A\u0627\u062C\u0631"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "number",
      value: settings.maxStoresPerMerchant,
      onChange: (e2) => handleInputChange("maxStoresPerMerchant", Number(e2.target.value)),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )))), activeTab === "users" && /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react20.default.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-4" }, "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646"), /* @__PURE__ */ import_react20.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0628\u0631\u064A\u062F \u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0641\u0646\u064A"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "email",
      value: settings.supportEmail,
      onChange: (e2) => handleInputChange("supportEmail", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0647\u0627\u062A\u0641 \u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0641\u0646\u064A"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "tel",
      value: settings.supportPhone,
      onChange: (e2) => handleInputChange("supportPhone", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )))), activeTab === "social" && /* @__PURE__ */ import_react20.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react20.default.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-4" }, "\u0631\u0648\u0627\u0628\u0637 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A"), /* @__PURE__ */ import_react20.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0631\u0627\u0628\u0637 \u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "url",
      value: settings.privacyPolicyUrl,
      onChange: (e2) => handleInputChange("privacyPolicyUrl", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0631\u0627\u0628\u0637 \u0634\u0631\u0648\u0637 \u0627\u0644\u062E\u062F\u0645\u0629"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "url",
      value: settings.termsOfServiceUrl,
      onChange: (e2) => handleInputChange("termsOfServiceUrl", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0631\u0627\u0628\u0637 Facebook"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "url",
      value: settings.socialLinks?.facebook || "",
      onChange: (e2) => handleInputChange("socialLinks.facebook", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0631\u0627\u0628\u0637 Twitter"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "url",
      value: settings.socialLinks?.twitter || "",
      onChange: (e2) => handleInputChange("socialLinks.twitter", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0631\u0627\u0628\u0637 Instagram"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "url",
      value: settings.socialLinks?.instagram || "",
      onChange: (e2) => handleInputChange("socialLinks.instagram", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react20.default.createElement("div", null, /* @__PURE__ */ import_react20.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0631\u0627\u0628\u0637 LinkedIn"), /* @__PURE__ */ import_react20.default.createElement(
    "input",
    {
      type: "url",
      value: settings.socialLinks?.linkedin || "",
      onChange: (e2) => handleInputChange("socialLinks.linkedin", e2.target.value),
      className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
    }
  )))), /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex justify-between items-center mt-8 pt-6 border-t border-gray-200" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ import_react20.default.createElement(
    "button",
    {
      onClick: handleResetSettings,
      disabled: isLoading,
      className: "flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    },
    /* @__PURE__ */ import_react20.default.createElement(RefreshCw, { className: "w-5 h-5" }),
    "\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646"
  ), hasUnsavedChanges && /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-2 text-orange-600" }, /* @__PURE__ */ import_react20.default.createElement("div", { className: "w-2 h-2 bg-orange-600 rounded-full animate-pulse" }), /* @__PURE__ */ import_react20.default.createElement("span", { className: "text-sm" }, "\u062A\u0648\u062C\u062F \u062A\u063A\u064A\u064A\u0631\u0627\u062A \u063A\u064A\u0631 \u0645\u062D\u0641\u0648\u0638\u0629")), lastSaved && !hasUnsavedChanges && /* @__PURE__ */ import_react20.default.createElement("div", { className: "flex items-center gap-2 text-green-600" }, /* @__PURE__ */ import_react20.default.createElement(CircleCheckBig, { className: "w-4 h-4" }), /* @__PURE__ */ import_react20.default.createElement("span", { className: "text-sm" }, "\u062A\u0645 \u0627\u0644\u062D\u0641\u0638: ", lastSaved.toLocaleTimeString("ar-EG")))), /* @__PURE__ */ import_react20.default.createElement(
    "button",
    {
      onClick: handleSaveSettings,
      disabled: isLoading || !hasUnsavedChanges,
      className: `flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${isLoading || !hasUnsavedChanges ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg transform hover:scale-105"}`
    },
    isLoading ? /* @__PURE__ */ import_react20.default.createElement(import_react20.default.Fragment, null, /* @__PURE__ */ import_react20.default.createElement(LoaderCircle, { className: "w-5 h-5 animate-spin" }), "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638...") : /* @__PURE__ */ import_react20.default.createElement(import_react20.default.Fragment, null, /* @__PURE__ */ import_react20.default.createElement(Save, { className: "w-5 h-5" }), "\u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A")
  )))));
}

// src/components/AdminSuperStoreManagement.tsx
var import_react22 = __toESM(require_react(), 1);
function AdminSuperStoreManagement() {
  const [selectedStore, setSelectedStore] = (0, import_react22.useState)(null);
  const [editingStore, setEditingStore] = (0, import_react22.useState)(null);
  const [editingProduct, setEditingProduct] = (0, import_react22.useState)(null);
  const [searchQuery, setSearchQuery] = (0, import_react22.useState)("");
  const [filterStatus, setFilterStatus] = (0, import_react22.useState)("all");
  const [isLoading, setIsLoading] = (0, import_react22.useState)(false);
  const [currentPage, setCurrentPage] = (0, import_react22.useState)(1);
  const [storesPerPage] = (0, import_react22.useState)(10);
  const [showPasswordReset, setShowPasswordReset] = (0, import_react22.useState)(false);
  const [newPassword, setNewPassword] = (0, import_react22.useState)("");
  const [selectedMerchantId, setSelectedMerchantId] = (0, import_react22.useState)(null);
  const allStores = useQuery(api.permissions.getAllStoresAsAdmin);
  const updateStore = useMutation(api.permissions.updateAnyStoreAsAdmin);
  const updateProduct = useMutation(api.permissions.updateAnyProductAsAdmin);
  const deleteProduct = useMutation(api.permissions.deleteAnyProductAsAdmin);
  const updateMerchant = useMutation(api.permissions.updateAnyMerchantAsAdmin);
  const toggleProductVisibility = useMutation(api.permissions.toggleProductVisibilityAsAdmin);
  const toggleStoreStatus = useMutation(api.permissions.toggleStoreStatusAsAdmin);
  const storesWithDetails = import_react22.default.useMemo(() => {
    if (!allStores) return [];
    return allStores.map((store) => ({
      ...store,
      owner: void 0,
      // سيتم جلبها عند الحاجة
      products: []
      // سيتم جلبها عند الحاجة
    }));
  }, [allStores]);
  const filteredStores = import_react22.default.useMemo(() => {
    let filtered = storesWithDetails;
    if (searchQuery) {
      filtered = filtered.filter(
        (store) => store.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || store.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (store) => filterStatus === "active" ? store.isActive : !store.isActive
      );
    }
    return filtered;
  }, [storesWithDetails, searchQuery, filterStatus]);
  const handleStoreSelect = async (store) => {
    setSelectedStore(store);
    setIsLoading(true);
    try {
    } catch (error) {
      n2.error("\u0641\u0634\u0644 \u0641\u064A \u062C\u0644\u0628 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631");
    } finally {
      setIsLoading(false);
    }
  };
  const handleStoreUpdate = async (storeId, updates) => {
    try {
      console.log("Updating store:", { storeId, updates });
      await updateStore({ storeId, updates });
      n2.success("\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u062A\u062C\u0631 \u0628\u0646\u062C\u0627\u062D");
      setEditingStore(null);
    } catch (error) {
      console.error("Store update error:", error);
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u062A\u062C\u0631");
    }
  };
  const handleProductUpdate = async (productId, updates) => {
    try {
      await updateProduct({ productId, updates });
      n2.success("\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0646\u062A\u062C \u0628\u0646\u062C\u0627\u062D");
      setEditingProduct(null);
    } catch (error) {
      n2.error("\u0641\u0634\u0644 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0646\u062A\u062C");
    }
  };
  const handleProductDelete = async (productId) => {
    if (!confirm("\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062A\u062C\u061F")) return;
    try {
      await deleteProduct({ productId });
      n2.success("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0646\u062A\u062C \u0628\u0646\u062C\u0627\u062D");
    } catch (error) {
      n2.error("\u0641\u0634\u0644 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0645\u0646\u062A\u062C");
    }
  };
  const handleToggleProductVisibility = async (productId, isVisible) => {
    try {
      await toggleProductVisibility({ productId, isVisible });
      n2.success(`\u062A\u0645 ${isVisible ? "\u0625\u0638\u0647\u0627\u0631" : "\u0625\u062E\u0641\u0627\u0621"} \u0627\u0644\u0645\u0646\u062A\u062C`);
    } catch (error) {
      n2.error("\u0641\u0634\u0644 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u0646\u062A\u062C");
    }
  };
  const handleToggleStoreStatus = async (storeId, isActive) => {
    try {
      await toggleStoreStatus({ storeId, isActive });
      n2.success(`\u062A\u0645 ${isActive ? "\u062A\u0641\u0639\u064A\u0644" : "\u0625\u0644\u063A\u0627\u0621 \u062A\u0641\u0639\u064A\u0644"} \u0627\u0644\u0645\u062A\u062C\u0631`);
    } catch (error) {
      n2.error("\u0641\u0634\u0644 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u062A\u062C\u0631");
    }
  };
  const handlePasswordReset = (merchantId) => {
    setSelectedMerchantId(merchantId);
    setShowPasswordReset(true);
  };
  const executePasswordReset = async () => {
    if (!selectedMerchantId || !newPassword) {
      n2.error("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062C\u062F\u064A\u062F\u0629");
      return;
    }
    try {
      console.log("Password reset for:", selectedMerchantId);
      n2.success("\u062A\u0645 \u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0628\u0646\u062C\u0627\u062D");
      setShowPasswordReset(false);
      setNewPassword("");
      setSelectedMerchantId(null);
    } catch (error) {
      n2.error("\u0641\u0634\u0644 \u0641\u064A \u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631");
    }
  };
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);
  return /* @__PURE__ */ import_react22.default.createElement("div", { className: "min-h-screen bg-gray-50 p-6", dir: "rtl" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "bg-white rounded-xl shadow-sm p-6 mb-6" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react22.default.createElement(Store, { className: "w-8 h-8 text-purple-600" }), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0634\u0627\u0645\u0644\u0629 \u0644\u0644\u0645\u062A\u0627\u062C\u0631"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-600" }, "\u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0643\u0627\u0645\u0644\u0629 \u0639\u0644\u0649 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0648\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A"))), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => window.location.reload(),
      className: "flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    },
    /* @__PURE__ */ import_react22.default.createElement(RefreshCw, { className: "w-4 h-4" }),
    "\u062A\u062D\u062F\u064A\u062B"
  )), /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex flex-col sm:flex-row gap-4" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex-1 relative" }, /* @__PURE__ */ import_react22.default.createElement(Search, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), /* @__PURE__ */ import_react22.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u0645\u062A\u062C\u0631...",
      value: searchQuery,
      onChange: (e2) => setSearchQuery(e2.target.value),
      className: "w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    }
  )), /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => setFilterStatus("all"),
      className: `px-4 py-2 rounded-lg transition-colors ${filterStatus === "all" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`
    },
    "\u0627\u0644\u0643\u0644"
  ), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => setFilterStatus("active"),
      className: `px-4 py-2 rounded-lg transition-colors ${filterStatus === "active" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`
    },
    "\u0646\u0634\u0637"
  ), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => setFilterStatus("inactive"),
      className: `px-4 py-2 rounded-lg transition-colors ${filterStatus === "inactive" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`
    },
    "\u0645\u0639\u0637\u0644"
  )))), /* @__PURE__ */ import_react22.default.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "lg:col-span-1" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "bg-white rounded-xl shadow-sm" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "p-4 border-b border-gray-200" }, /* @__PURE__ */ import_react22.default.createElement("h2", { className: "text-lg font-semibold text-gray-900" }, "\u0627\u0644\u0645\u062A\u0627\u062C\u0631 (", filteredStores.length, ")")), /* @__PURE__ */ import_react22.default.createElement("div", { className: "max-h-96 overflow-y-auto" }, currentStores.map((store) => /* @__PURE__ */ import_react22.default.createElement(
    "div",
    {
      key: store._id,
      onClick: () => handleStoreSelect(store),
      className: `p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedStore?._id === store._id ? "bg-purple-50 border-purple-200" : "hover:bg-gray-50"}`
    },
    /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex-1" }, /* @__PURE__ */ import_react22.default.createElement("h3", { className: "font-semibold text-gray-900" }, store.nameAr), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-sm text-gray-600" }, store.address), store.owner?.email && /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-sm text-blue-600 mt-1" }, store.owner.email), /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center gap-2 mt-2" }, /* @__PURE__ */ import_react22.default.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${store.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}` }, store.isActive ? "\u0646\u0634\u0637" : "\u0645\u0639\u0637\u0644"))), store.imageUrl && /* @__PURE__ */ import_react22.default.createElement(
      "img",
      {
        src: store.imageUrl,
        alt: store.nameAr,
        className: "w-12 h-12 rounded-lg object-cover"
      }
    ))
  ))))), /* @__PURE__ */ import_react22.default.createElement("div", { className: "lg:col-span-2" }, selectedStore ? /* @__PURE__ */ import_react22.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "bg-white rounded-xl shadow-sm p-6" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ import_react22.default.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631"), /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => setEditingStore(selectedStore),
      className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    },
    /* @__PURE__ */ import_react22.default.createElement(SquarePen, { className: "w-4 h-4" }),
    "\u062A\u0639\u062F\u064A\u0644"
  ), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => handleToggleStoreStatus(selectedStore._id, !selectedStore.isActive),
      className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${selectedStore.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white`
    },
    /* @__PURE__ */ import_react22.default.createElement(Power, { className: "w-4 h-4" }),
    selectedStore.isActive ? "\u062A\u0639\u0637\u064A\u0644" : "\u062A\u0641\u0639\u064A\u0644"
  ))), editingStore?._id === selectedStore._id ? /* @__PURE__ */ import_react22.default.createElement(
    StoreEditForm,
    {
      store: editingStore,
      onSave: handleStoreUpdate,
      onCancel: () => setEditingStore(null)
    }
  ) : /* @__PURE__ */ import_react22.default.createElement(
    StoreInfoDisplay,
    {
      store: selectedStore,
      onPasswordReset: setSelectedMerchantId
    }
  )), /* @__PURE__ */ import_react22.default.createElement("div", { className: "bg-white rounded-xl shadow-sm p-6" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ import_react22.default.createElement("h2", { className: "text-xl font-semibold text-gray-900" }, "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A"), /* @__PURE__ */ import_react22.default.createElement("button", { className: "flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors" }, /* @__PURE__ */ import_react22.default.createElement(Plus, { className: "w-4 h-4" }), "\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062A\u062C")), selectedStore.products && selectedStore.products.length > 0 ? /* @__PURE__ */ import_react22.default.createElement("div", { className: "space-y-4" }, selectedStore.products.map((product) => /* @__PURE__ */ import_react22.default.createElement(
    ProductCard,
    {
      key: product._id,
      product,
      onEdit: setEditingProduct,
      onDelete: handleProductDelete,
      onToggleVisibility: handleToggleProductVisibility,
      onUpdate: handleProductUpdate
    }
  ))) : /* @__PURE__ */ import_react22.default.createElement("div", { className: "text-center py-8" }, /* @__PURE__ */ import_react22.default.createElement(Package, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-500" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0646\u062A\u062C\u0627\u062A \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u062A\u062C\u0631")))) : /* @__PURE__ */ import_react22.default.createElement("div", { className: "bg-white rounded-xl shadow-sm p-12 text-center" }, /* @__PURE__ */ import_react22.default.createElement(Store, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), /* @__PURE__ */ import_react22.default.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-2" }, "\u0627\u062E\u062A\u0631 \u0645\u062A\u062C\u0631\u0627\u064B"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-600" }, "\u0627\u062E\u062A\u0631 \u0645\u062A\u062C\u0631\u0627\u064B \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0644\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0648\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062D\u062A\u0648\u0649")))), totalPages > 1 && /* @__PURE__ */ import_react22.default.createElement("div", { className: "mt-6" }, /* @__PURE__ */ import_react22.default.createElement(
    PaginationControls,
    {
      currentPage,
      totalPages,
      onPageChange: setCurrentPage
    }
  )), /* @__PURE__ */ import_react22.default.createElement(
    PasswordResetModal,
    {
      isOpen: showPasswordReset,
      onClose: () => {
        setShowPasswordReset(false);
        setNewPassword("");
        setSelectedMerchantId(null);
      },
      onReset: executePasswordReset,
      newPassword,
      setNewPassword
    }
  )));
}
function StoreInfoDisplay({ store, onPasswordReset }) {
  return /* @__PURE__ */ import_react22.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "text-sm font-medium text-gray-500" }, "\u0627\u0644\u0627\u0633\u0645 (\u0639\u0631\u0628\u064A)"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-900" }, store.nameAr)), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "text-sm font-medium text-gray-500" }, "\u0627\u0644\u0627\u0633\u0645 (\u0625\u0646\u062C\u0644\u064A\u0632\u064A)"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-900" }, store.nameEn)), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "text-sm font-medium text-gray-500" }, "\u0627\u0644\u0639\u0646\u0648\u0627\u0646"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-900" }, store.address)), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "text-sm font-medium text-gray-500" }, "\u0627\u0644\u0647\u0627\u062A\u0641"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-900" }, store.phone)), store.owner?.email && /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "text-sm font-medium text-gray-500" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-900" }, store.owner.email)), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "text-sm font-medium text-gray-500" }, "\u0648\u0642\u062A \u0627\u0644\u062A\u0648\u0635\u064A\u0644"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-900" }, store.estimatedDeliveryTime, " \u062F\u0642\u064A\u0642\u0629")), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "text-sm font-medium text-gray-500" }, "\u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u062A\u0627\u062C\u0631"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-900" }, store.commissionRate, "%"))), store.owner && /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex gap-3 pt-4 border-t border-gray-200" }, /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => onPasswordReset(store.owner._id),
      className: "flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
    },
    /* @__PURE__ */ import_react22.default.createElement(Key, { className: "w-4 h-4" }),
    "\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
  )), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "text-sm font-medium text-gray-500" }, "\u0627\u0644\u0648\u0635\u0641 (\u0639\u0631\u0628\u064A)"), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-gray-900" }, store.descriptionAr)), store.imageUrl && /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "text-sm font-medium text-gray-500" }, "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u062A\u062C\u0631"), /* @__PURE__ */ import_react22.default.createElement(
    "img",
    {
      src: store.imageUrl,
      alt: store.nameAr,
      className: "mt-2 w-32 h-32 rounded-lg object-cover"
    }
  )));
}
function StoreEditForm({ store, onSave, onCancel }) {
  const [formData, setFormData] = (0, import_react22.useState)({
    nameAr: store.nameAr,
    nameEn: store.nameEn,
    descriptionAr: store.descriptionAr,
    descriptionEn: store.descriptionEn,
    address: store.address,
    phone: store.phone,
    estimatedDeliveryTime: store.estimatedDeliveryTime,
    commissionRate: store.commissionRate
  });
  const handleSubmit = (e2) => {
    e2.preventDefault();
    onSave(store._id, formData);
  };
  return /* @__PURE__ */ import_react22.default.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0627\u0633\u0645 (\u0639\u0631\u0628\u064A)"), /* @__PURE__ */ import_react22.default.createElement(
    "input",
    {
      type: "text",
      value: formData.nameAr,
      onChange: (e2) => setFormData({ ...formData, nameAr: e2.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      required: true
    }
  )), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0627\u0633\u0645 (\u0625\u0646\u062C\u0644\u064A\u0632\u064A)"), /* @__PURE__ */ import_react22.default.createElement(
    "input",
    {
      type: "text",
      value: formData.nameEn,
      onChange: (e2) => setFormData({ ...formData, nameEn: e2.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      required: true
    }
  )), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0639\u0646\u0648\u0627\u0646"), /* @__PURE__ */ import_react22.default.createElement(
    "input",
    {
      type: "text",
      value: formData.address,
      onChange: (e2) => setFormData({ ...formData, address: e2.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      required: true
    }
  )), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0647\u0627\u062A\u0641"), /* @__PURE__ */ import_react22.default.createElement(
    "input",
    {
      type: "tel",
      value: formData.phone,
      onChange: (e2) => setFormData({ ...formData, phone: e2.target.value }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      required: true
    }
  )), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0648\u0642\u062A \u0627\u0644\u062A\u0648\u0635\u064A\u0644 (\u062F\u0642\u064A\u0642\u0629)"), /* @__PURE__ */ import_react22.default.createElement(
    "input",
    {
      type: "number",
      value: formData.estimatedDeliveryTime,
      onChange: (e2) => setFormData({ ...formData, estimatedDeliveryTime: parseInt(e2.target.value) }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      required: true
    }
  )), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u062A\u0627\u062C\u0631 (%)"), /* @__PURE__ */ import_react22.default.createElement(
    "input",
    {
      type: "number",
      step: "0.1",
      value: formData.commissionRate,
      onChange: (e2) => setFormData({ ...formData, commissionRate: parseFloat(e2.target.value) }),
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      required: true
    }
  ))), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0648\u0635\u0641 (\u0639\u0631\u0628\u064A)"), /* @__PURE__ */ import_react22.default.createElement(
    "textarea",
    {
      value: formData.descriptionAr,
      onChange: (e2) => setFormData({ ...formData, descriptionAr: e2.target.value }),
      rows: 3,
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      required: true
    }
  )), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0627\u0644\u0648\u0635\u0641 (\u0625\u0646\u062C\u0644\u064A\u0632\u064A)"), /* @__PURE__ */ import_react22.default.createElement(
    "textarea",
    {
      value: formData.descriptionEn,
      onChange: (e2) => setFormData({ ...formData, descriptionEn: e2.target.value }),
      rows: 3,
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent",
      required: true
    }
  )), /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      type: "submit",
      className: "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    },
    /* @__PURE__ */ import_react22.default.createElement(Save, { className: "w-4 h-4" }),
    "\u062D\u0641\u0638"
  ), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      type: "button",
      onClick: onCancel,
      className: "flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
    },
    /* @__PURE__ */ import_react22.default.createElement(X2, { className: "w-4 h-4" }),
    "\u0625\u0644\u063A\u0627\u0621"
  )));
}
function ProductCard({ product, onEdit, onDelete, onToggleVisibility, onUpdate }) {
  return /* @__PURE__ */ import_react22.default.createElement("div", { className: "border border-gray-200 rounded-lg p-4" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex-1" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center gap-3" }, product.images && product.images.length > 0 && /* @__PURE__ */ import_react22.default.createElement(
    "img",
    {
      src: product.images[0],
      alt: product.nameAr,
      className: "w-16 h-16 rounded-lg object-cover"
    }
  ), /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("h4", { className: "font-semibold text-gray-900" }, product.nameAr), /* @__PURE__ */ import_react22.default.createElement("p", { className: "text-sm text-gray-600" }, product.price, " \u062C.\u0645"), /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center gap-2 mt-1" }, /* @__PURE__ */ import_react22.default.createElement("span", { className: `px-2 py-1 text-xs rounded-full ${product.isActive && product.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}` }, product.isActive && product.isAvailable ? "\u0645\u062A\u0627\u062D" : "\u063A\u064A\u0631 \u0645\u062A\u0627\u062D"), /* @__PURE__ */ import_react22.default.createElement("span", { className: "text-xs text-gray-500" }, "\u0627\u0644\u0643\u0645\u064A\u0629: ", product.quantity))))), /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => onToggleVisibility(product._id, !(product.isActive && product.isAvailable)),
      className: `p-2 rounded-lg transition-colors ${product.isActive && product.isAvailable ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`,
      title: product.isActive && product.isAvailable ? "\u0625\u062E\u0641\u0627\u0621" : "\u0625\u0638\u0647\u0627\u0631"
    },
    product.isActive && product.isAvailable ? /* @__PURE__ */ import_react22.default.createElement(Eye, { className: "w-4 h-4" }) : /* @__PURE__ */ import_react22.default.createElement(EyeOff, { className: "w-4 h-4" })
  ), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => onEdit(product),
      className: "p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors",
      title: "\u062A\u0639\u062F\u064A\u0644"
    },
    /* @__PURE__ */ import_react22.default.createElement(SquarePen, { className: "w-4 h-4" })
  ), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => onDelete(product._id),
      className: "p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors",
      title: "\u062D\u0630\u0641"
    },
    /* @__PURE__ */ import_react22.default.createElement(Trash2, { className: "w-4 h-4" })
  ))));
}
function PasswordResetModal({
  isOpen,
  onClose,
  onReset,
  newPassword,
  setNewPassword
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ import_react22.default.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "bg-white rounded-xl p-6 w-96" }, /* @__PURE__ */ import_react22.default.createElement("h3", { className: "text-xl font-semibold text-gray-900 mb-4" }, "\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"), /* @__PURE__ */ import_react22.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629"), /* @__PURE__ */ import_react22.default.createElement(
    "input",
    {
      type: "password",
      value: newPassword,
      onChange: (e2) => setNewPassword(e2.target.value),
      className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
      placeholder: "\u0623\u062F\u062E\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629"
    }
  ))), /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex gap-3 mt-6" }, /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: onReset,
      className: "flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
    },
    "\u062A\u063A\u064A\u064A\u0631"
  ), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: onClose,
      className: "flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
    },
    "\u0625\u0644\u063A\u0627\u0621"
  ))));
}
function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center justify-between py-4" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => onPageChange(currentPage - 1),
      disabled: currentPage === 1,
      className: `p-2 rounded-lg transition-colors ${currentPage === 1 ? "bg-gray-200 text-gray-500" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`
    },
    "\u0627\u0644\u0633\u0627\u0628\u0642"
  ), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      onClick: () => onPageChange(currentPage + 1),
      disabled: currentPage === totalPages,
      className: `p-2 rounded-lg transition-colors ${currentPage === totalPages ? "bg-gray-200 text-gray-500" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`
    },
    "\u0627\u0644\u062A\u0627\u0644\u064A"
  )), /* @__PURE__ */ import_react22.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react22.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0627\u0644\u0635\u0641\u062D\u0629 ", currentPage, " \u0645\u0646 ", totalPages)));
}

// src/components/AdminDataExport.tsx
var import_react24 = __toESM(require_react(), 1);
function AdminDataExport() {
  const [exportingType, setExportingType] = (0, import_react24.useState)(null);
  const [exportHistory, setExportHistory] = (0, import_react24.useState)([]);
  const usersData = useQuery(api.adminExport.exportUsers);
  const storesData = useQuery(api.adminExport.exportStores);
  const productsData = useQuery(api.adminExport.exportProducts);
  const ordersData = useQuery(api.adminExport.exportOrders);
  const captainsData = useQuery(api.adminExport.exportCaptains);
  const reviewsData = useQuery(api.adminExport.exportReviews);
  const walletsData = useQuery(api.adminExport.exportWallets);
  const allData = useQuery(api.adminExport.exportAllData);
  const exportTypes = [
    {
      id: "users",
      name: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646",
      description: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0648\u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0627\u0644\u0634\u062E\u0635\u064A\u0629",
      icon: Users,
      color: "blue",
      query: usersData
    },
    {
      id: "stores",
      name: "\u0627\u0644\u0645\u062A\u0627\u062C\u0631",
      description: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0648\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u062A\u0627\u062C\u0631",
      icon: Store,
      color: "purple",
      query: storesData
    },
    {
      id: "products",
      name: "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A",
      description: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644",
      icon: Package,
      color: "green",
      query: productsData
    },
    {
      id: "orders",
      name: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A",
      description: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644",
      icon: ShoppingCart,
      color: "orange",
      query: ordersData
    },
    {
      id: "captains",
      name: "\u0627\u0644\u0643\u0628\u0627\u062A\u0646",
      description: "\u062C\u0645\u064A\u0639 \u0627\u0644\u0643\u0628\u0627\u062A\u0646 \u0648\u0645\u0639\u0644\u0648\u0645\u0627\u062A\u0647\u0645",
      icon: Truck,
      color: "red",
      query: captainsData
    },
    {
      id: "reviews",
      name: "\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0627\u062A",
      description: "\u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0648\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0627\u062A",
      icon: Star,
      color: "indigo",
      query: reviewsData
    },
    {
      id: "wallets",
      name: "\u0627\u0644\u0645\u062D\u0627\u0641\u0638",
      description: "\u0627\u0644\u0645\u062D\u0627\u0641\u0638 \u0648\u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062A \u0627\u0644\u0645\u0627\u0644\u064A\u0629",
      icon: Wallet,
      color: "pink",
      query: walletsData
    }
  ];
  const downloadJSON = (data2, filename) => {
    const jsonString = JSON.stringify(data2, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const downloadCSV = (data2, filename) => {
    if (data2.length === 0) return;
    const headers = Object.keys(data2[0]);
    const csvHeaders = headers.join(",");
    const csvRows = data2.map((row) => {
      return headers.map((header) => {
        const value = row[header];
        if (value === null || value === void 0) return "";
        if (typeof value === "object") return JSON.stringify(value);
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(",");
    });
    const csvContent = [csvHeaders, ...csvRows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleExport = async (type, format) => {
    setExportingType(type);
    try {
      let data2;
      let filename;
      switch (type) {
        case "users":
          data2 = usersData;
          filename = `users_export_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        case "stores":
          data2 = storesData;
          filename = `stores_export_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        case "products":
          data2 = productsData;
          filename = `products_export_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        case "orders":
          data2 = ordersData;
          filename = `orders_export_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        case "captains":
          data2 = captainsData;
          filename = `captains_export_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        case "reviews":
          data2 = reviewsData;
          filename = `reviews_export_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        case "wallets":
          data2 = walletsData;
          filename = `wallets_export_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        case "all":
          data2 = allData;
          filename = `all_data_export_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        default:
          throw new Error("\u0646\u0648\u0639 \u062A\u0635\u062F\u064A\u0631 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D");
      }
      if (format === "json") {
        downloadJSON(data2, `${filename}.json`);
      } else {
        if (type === "wallets") {
          const walletData = data2;
          downloadCSV(walletData.wallets, `${filename}_wallets.csv`);
          downloadCSV(walletData.transactions, `${filename}_transactions.csv`);
        } else if (type === "all") {
          const allDataExport = data2;
          Object.entries(allDataExport.data).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              downloadCSV(value, `${filename}_${key}.csv`);
            }
          });
        } else {
          const exportData = data2;
          downloadCSV(exportData.data, `${filename}.csv`);
        }
      }
      setExportHistory((prev) => [...prev, {
        type,
        timestamp: Date.now(),
        count: type === "all" ? data2.summary.totalRecords : type === "wallets" ? data2.walletsCount + data2.transactionsCount : data2.count
      }]);
      n2.success(`\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 ${type === "all" ? "\u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A" : exportTypes.find((t2) => t2.id === type)?.name} \u0628\u0646\u062C\u0627\u062D`);
    } catch (error) {
      n2.error("\u0641\u0634\u0644 \u0641\u064A \u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A");
      console.error("Export error:", error);
    } finally {
      setExportingType(null);
    }
  };
  const getRecordCount = (type) => {
    switch (type) {
      case "users":
        return usersData?.count || 0;
      case "stores":
        return storesData?.count || 0;
      case "products":
        return productsData?.count || 0;
      case "orders":
        return ordersData?.count || 0;
      case "captains":
        return captainsData?.count || 0;
      case "reviews":
        return reviewsData?.count || 0;
      case "wallets":
        return (walletsData?.walletsCount || 0) + (walletsData?.transactionsCount || 0);
      case "all":
        return allData?.summary.totalRecords || 0;
      default:
        return 0;
    }
  };
  return /* @__PURE__ */ import_react24.default.createElement("div", { className: "min-h-screen bg-gray-50 p-6", dir: "rtl" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "bg-white rounded-xl shadow-sm p-6 mb-6" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react24.default.createElement(Database, { className: "w-8 h-8 text-purple-600" }), /* @__PURE__ */ import_react24.default.createElement("div", null, /* @__PURE__ */ import_react24.default.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "\u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-gray-600" }, "\u062A\u0635\u062F\u064A\u0631 \u062C\u0645\u064A\u0639 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0646\u0638\u0627\u0645 \u0628\u0635\u064A\u063A \u0645\u062E\u062A\u0644\u0641\u0629")))), /* @__PURE__ */ import_react24.default.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "bg-blue-50 rounded-lg p-4" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react24.default.createElement(Users, { className: "w-5 h-5 text-blue-600" }), /* @__PURE__ */ import_react24.default.createElement("span", { className: "text-sm font-medium text-blue-900" }, "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646")), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-2xl font-bold text-blue-900 mt-1" }, getRecordCount("users"))), /* @__PURE__ */ import_react24.default.createElement("div", { className: "bg-purple-50 rounded-lg p-4" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react24.default.createElement(Store, { className: "w-5 h-5 text-purple-600" }), /* @__PURE__ */ import_react24.default.createElement("span", { className: "text-sm font-medium text-purple-900" }, "\u0627\u0644\u0645\u062A\u0627\u062C\u0631")), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-2xl font-bold text-purple-900 mt-1" }, getRecordCount("stores"))), /* @__PURE__ */ import_react24.default.createElement("div", { className: "bg-green-50 rounded-lg p-4" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react24.default.createElement(Package, { className: "w-5 h-5 text-green-600" }), /* @__PURE__ */ import_react24.default.createElement("span", { className: "text-sm font-medium text-green-900" }, "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A")), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-2xl font-bold text-green-900 mt-1" }, getRecordCount("products"))), /* @__PURE__ */ import_react24.default.createElement("div", { className: "bg-orange-50 rounded-lg p-4" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react24.default.createElement(ShoppingCart, { className: "w-5 h-5 text-orange-600" }), /* @__PURE__ */ import_react24.default.createElement("span", { className: "text-sm font-medium text-orange-900" }, "\u0627\u0644\u0637\u0644\u0628\u0627\u062A")), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-2xl font-bold text-orange-900 mt-1" }, getRecordCount("orders"))))), /* @__PURE__ */ import_react24.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" }, exportTypes.map((type) => {
    const Icon2 = type.icon;
    const count = getRecordCount(type.id);
    const isLoading = exportingType === type.id;
    const queryData = type.query;
    return /* @__PURE__ */ import_react24.default.createElement("div", { key: type.id, className: "bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-start justify-between mb-4" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: `p-2 bg-${type.color}-100 rounded-lg` }, /* @__PURE__ */ import_react24.default.createElement(Icon2, { className: `w-6 h-6 text-${type.color}-600` })), /* @__PURE__ */ import_react24.default.createElement("div", null, /* @__PURE__ */ import_react24.default.createElement("h3", { className: "font-semibold text-gray-900" }, type.name), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-sm text-gray-600" }, type.description))), /* @__PURE__ */ import_react24.default.createElement("div", { className: "text-left" }, /* @__PURE__ */ import_react24.default.createElement("span", { className: "text-2xl font-bold text-gray-900" }, count), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-xs text-gray-500" }, "\u0633\u062C\u0644"))), queryData === void 0 ? /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-2 text-yellow-600 bg-yellow-50 rounded-lg p-3" }, /* @__PURE__ */ import_react24.default.createElement(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ import_react24.default.createElement("span", { className: "text-sm" }, "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")) : queryData === null ? /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3" }, /* @__PURE__ */ import_react24.default.createElement(CircleAlert, { className: "w-4 h-4" }), /* @__PURE__ */ import_react24.default.createElement("span", { className: "text-sm" }, "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A")) : /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react24.default.createElement(
      "button",
      {
        onClick: () => handleExport(type.id, "json"),
        disabled: isLoading,
        className: `flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`
      },
      isLoading ? /* @__PURE__ */ import_react24.default.createElement(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ import_react24.default.createElement(Download, { className: "w-4 h-4" }),
      "JSON"
    ), /* @__PURE__ */ import_react24.default.createElement(
      "button",
      {
        onClick: () => handleExport(type.id, "csv"),
        disabled: isLoading,
        className: `flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`
      },
      isLoading ? /* @__PURE__ */ import_react24.default.createElement(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ import_react24.default.createElement(FileText, { className: "w-4 h-4" }),
      "CSV"
    )));
  })), /* @__PURE__ */ import_react24.default.createElement("div", { className: "bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-sm p-6 text-white mb-8" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react24.default.createElement("div", null, /* @__PURE__ */ import_react24.default.createElement("h2", { className: "text-xl font-bold mb-2" }, "\u062A\u0635\u062F\u064A\u0631 \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-purple-100" }, "\u062A\u0635\u062F\u064A\u0631 \u062C\u0645\u064A\u0639 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0646\u0638\u0627\u0645 \u0641\u064A \u0645\u0644\u0641 \u0648\u0627\u062D\u062F"), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-sm text-purple-200 mt-1" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u062C\u0644\u0627\u062A: ", getRecordCount("all"))), /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ import_react24.default.createElement(
    "button",
    {
      onClick: () => handleExport("all", "json"),
      disabled: exportingType === "all",
      className: `flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors ${exportingType === "all" ? "opacity-50 cursor-not-allowed" : ""}`
    },
    exportingType === "all" ? /* @__PURE__ */ import_react24.default.createElement(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ import_react24.default.createElement(Download, { className: "w-5 h-5" }),
    "\u062A\u0635\u062F\u064A\u0631 JSON"
  ), /* @__PURE__ */ import_react24.default.createElement(
    "button",
    {
      onClick: () => handleExport("all", "csv"),
      disabled: exportingType === "all",
      className: `flex items-center gap-2 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors ${exportingType === "all" ? "opacity-50 cursor-not-allowed" : ""}`
    },
    exportingType === "all" ? /* @__PURE__ */ import_react24.default.createElement(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ import_react24.default.createElement(FileText, { className: "w-5 h-5" }),
    "\u062A\u0635\u062F\u064A\u0631 CSV"
  )))), exportHistory.length > 0 && /* @__PURE__ */ import_react24.default.createElement("div", { className: "bg-white rounded-xl shadow-sm p-6" }, /* @__PURE__ */ import_react24.default.createElement("h2", { className: "text-lg font-semibold text-gray-900 mb-4" }, "\u0633\u062C\u0644 \u0627\u0644\u062A\u0635\u062F\u064A\u0631"), /* @__PURE__ */ import_react24.default.createElement("div", { className: "space-y-2" }, exportHistory.slice(-5).reverse().map((exportItem, index) => {
    const typeInfo = exportTypes.find((t2) => t2.id === exportItem.type);
    const Icon2 = typeInfo?.icon || FileText;
    return /* @__PURE__ */ import_react24.default.createElement("div", { key: index, className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react24.default.createElement(Icon2, { className: "w-5 h-5 text-gray-600" }), /* @__PURE__ */ import_react24.default.createElement("div", null, /* @__PURE__ */ import_react24.default.createElement("p", { className: "font-medium text-gray-900" }, typeInfo?.name || exportItem.type), /* @__PURE__ */ import_react24.default.createElement("p", { className: "text-sm text-gray-500" }, new Date(exportItem.timestamp).toLocaleString("ar-SA")))), /* @__PURE__ */ import_react24.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react24.default.createElement(CircleCheckBig, { className: "w-4 h-4 text-green-500" }), /* @__PURE__ */ import_react24.default.createElement("span", { className: "text-sm text-gray-600" }, exportItem.count, " \u0633\u062C\u0644")));
  })))));
}

// src/components/InvoicePrint.tsx
var import_react27 = __toESM(require_react(), 1);

// node_modules/react-to-print/dist/react-to-print.mjs
var import_react26 = __toESM(require_react(), 1);
var q = "printWindow";
function V(e2) {
  const t2 = document.createElement("iframe");
  return t2.width = `${document.documentElement.clientWidth}px`, t2.height = `${document.documentElement.clientHeight}px`, t2.style.position = "absolute", t2.style.top = `-${document.documentElement.clientHeight + 100}px`, t2.style.left = `-${document.documentElement.clientWidth + 100}px`, t2.id = q, t2.srcdoc = "<!DOCTYPE html>", e2 && (e2.allow && (t2.allow = e2.allow), e2.referrerPolicy !== void 0 && (t2.referrerPolicy = e2.referrerPolicy), e2.sandbox !== void 0 && (t2.sandbox = e2.sandbox)), t2;
}
function f3({ level: e2 = "error", messages: t2, suppressErrors: n3 = false }) {
  n3 || (e2 === "error" ? console.error(t2) : e2 === "warning" ? console.warn(t2) : console.debug(t2));
}
function $2(e2, t2) {
  if (t2 || !e2) {
    const n3 = document.getElementById(q);
    n3 && document.body.removeChild(n3);
  }
}
function P2(e2) {
  return e2 instanceof Error ? e2 : new Error("Unknown Error");
}
function H2(e2, t2) {
  const {
    documentTitle: n3,
    onAfterPrint: l2,
    onPrintError: p2,
    preserveAfterPrint: m2,
    print: h3,
    suppressErrors: g2
  } = t2;
  setTimeout(() => {
    if (e2.contentWindow) {
      let a2 = function() {
        l2?.(), $2(m2);
      };
      if (e2.contentWindow.focus(), h3)
        h3(e2).then(a2).catch((c2) => {
          p2 ? p2("print", P2(c2)) : f3({
            messages: ["An error was thrown by the specified `print` function"],
            suppressErrors: g2
          });
        });
      else {
        if (e2.contentWindow.print) {
          const c2 = e2.contentDocument?.title ?? "", E2 = e2.ownerDocument.title, y2 = typeof n3 == "function" ? n3() : n3;
          y2 && (e2.ownerDocument.title = y2, e2.contentDocument && (e2.contentDocument.title = y2)), e2.contentWindow.print(), y2 && (e2.ownerDocument.title = E2, e2.contentDocument && (e2.contentDocument.title = c2));
        } else
          f3({
            messages: ["Printing for this browser is not currently possible: the browser does not have a `print` method available for iframes."],
            suppressErrors: g2
          });
        z() ? setTimeout(a2, 500) : a2();
      }
    } else
      f3({
        messages: ["Printing failed because the `contentWindow` of the print iframe did not load. This is possibly an error with `react-to-print`. Please file an issue: https://github.com/MatthewHerbst/react-to-print/issues/"],
        suppressErrors: g2
      });
  }, 500);
}
function z() {
  return [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ].some((t2) => (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (navigator.userAgent ?? // Retained for compatibility with browsers that use `navigator.vendor` to identify the browser.
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    navigator.vendor ?? // Retained for compatibility with older versions of Opera that use `window.opera`.
    ("opera" in window && window.opera)).match(t2)
  ));
}
function O(e2) {
  const t2 = [], n3 = document.createTreeWalker(e2, NodeFilter.SHOW_ELEMENT, null);
  let l2 = n3.nextNode();
  for (; l2; )
    t2.push(l2), l2 = n3.nextNode();
  return t2;
}
function j2(e2, t2, n3) {
  const l2 = O(e2), p2 = O(t2);
  if (l2.length !== p2.length) {
    f3({
      messages: ["When cloning shadow root content, source and target elements have different size. `onBeforePrint` likely resolved too early.", e2, t2],
      suppressErrors: n3
    });
    return;
  }
  for (let m2 = 0; m2 < l2.length; m2++) {
    const h3 = l2[m2], g2 = p2[m2], a2 = h3.shadowRoot;
    if (a2 !== null) {
      const c2 = g2.attachShadow({ mode: a2.mode });
      c2.innerHTML = a2.innerHTML, j2(a2, c2, n3);
    }
  }
}
var G = `
    @page {
        /* Remove browser default header (title) and footer (url) */
        margin: 0;
    }
    @media print {
        body {
            /* Tell browsers to print background colors */
            color-adjust: exact; /* Firefox. This is an older version of "print-color-adjust" */
            print-color-adjust: exact; /* Firefox/Safari */
            -webkit-print-color-adjust: exact; /* Chrome/Safari/Edge/Opera */
        }
    }
`;
function W2(e2, t2, n3) {
  const {
    contentNode: l2,
    clonedContentNode: p2,
    clonedImgNodes: m2,
    clonedVideoNodes: h3,
    numResourcesToLoad: g2,
    originalCanvasNodes: a2
  } = t2, {
    bodyClass: c2,
    fonts: E2,
    ignoreGlobalStyles: y2,
    pageStyle: C2,
    nonce: T,
    suppressErrors: A2,
    copyShadowRoots: F2
  } = n3, L2 = [], _2 = [];
  function i2(k2, x2) {
    if (L2.includes(k2)) {
      f3({
        level: "debug",
        messages: ["Tried to mark a resource that has already been handled", k2],
        suppressErrors: A2
      });
      return;
    }
    x2 ? (f3({
      messages: [
        '"react-to-print" was unable to load a resource but will continue attempting to print the page',
        ...x2
      ],
      suppressErrors: A2
    }), _2.push(k2)) : L2.push(k2), L2.length + _2.length === g2 && H2(e2, n3);
  }
  e2.onload = null;
  const d2 = e2.contentDocument ?? e2.contentWindow?.document;
  if (d2) {
    const k2 = d2.body.appendChild(p2);
    F2 && j2(l2, k2, !!A2), E2 && (e2.contentDocument?.fonts && e2.contentWindow?.FontFace ? E2.forEach((s2) => {
      const o2 = new FontFace(
        s2.family,
        s2.source,
        { weight: s2.weight, style: s2.style }
      );
      e2.contentDocument.fonts.add(o2), o2.loaded.then(() => {
        i2(o2);
      }).catch((b3) => {
        i2(o2, ["Failed loading the font:", o2, "Load error:", P2(b3)]);
      });
    }) : (E2.forEach((s2) => {
      i2(s2);
    }), f3({
      messages: ['"react-to-print" is not able to load custom fonts because the browser does not support the FontFace API but will continue attempting to print the page'],
      suppressErrors: A2
    })));
    const x2 = C2 ?? G, D = d2.createElement("style");
    T && (D.setAttribute("nonce", T), d2.head.setAttribute("nonce", T)), D.appendChild(d2.createTextNode(x2)), d2.head.appendChild(D), c2 && d2.body.classList.add(...c2.split(" "));
    const U = d2.querySelectorAll("canvas");
    for (let s2 = 0; s2 < a2.length; ++s2) {
      const o2 = a2[s2], b3 = U[s2];
      if (b3 === void 0) {
        f3({
          messages: ["A canvas element could not be copied for printing, has it loaded? `onBeforePrint` likely resolved too early.", o2],
          suppressErrors: A2
        });
        continue;
      }
      const r = b3.getContext("2d");
      r && r.drawImage(o2, 0, 0);
    }
    for (let s2 = 0; s2 < m2.length; s2++) {
      const o2 = m2[s2], b3 = o2.getAttribute("src");
      if (!b3)
        i2(o2, ['Found an <img> tag with an empty "src" attribute. This prevents pre-loading it.', o2]);
      else {
        const r = new Image();
        r.onload = () => {
          i2(o2);
        }, r.onerror = (u2, w2, S2, v3, N2) => {
          i2(o2, ["Error loading <img>", o2, "Error", N2]);
        }, r.src = b3;
      }
    }
    for (let s2 = 0; s2 < h3.length; s2++) {
      const o2 = h3[s2];
      o2.preload = "auto";
      const b3 = o2.getAttribute("poster");
      if (b3) {
        const r = new Image();
        r.onload = () => {
          i2(o2);
        }, r.onerror = (u2, w2, S2, v3, N2) => {
          i2(o2, ["Error loading video poster", b3, "for video", o2, "Error:", N2]);
        }, r.src = b3;
      } else
        o2.readyState >= 2 ? i2(o2) : o2.src ? (o2.onloadeddata = () => {
          i2(o2);
        }, o2.onerror = (r, u2, w2, S2, v3) => {
          i2(o2, ["Error loading video", o2, "Error", v3]);
        }, o2.onstalled = () => {
          i2(o2, ["Loading video stalled, skipping", o2]);
        }) : i2(o2, ["Error loading video, `src` is empty", o2]);
    }
    const R = "select", M = l2.querySelectorAll(R), B = d2.querySelectorAll(R);
    for (let s2 = 0; s2 < M.length; s2++)
      B[s2].value = M[s2].value;
    if (!y2) {
      const s2 = document.querySelectorAll("style, link[rel~='stylesheet'], link[as='style']");
      for (let o2 = 0, b3 = s2.length; o2 < b3; ++o2) {
        const r = s2[o2];
        if (r.tagName.toLowerCase() === "style") {
          const u2 = d2.createElement(r.tagName), w2 = r.sheet;
          if (w2) {
            let S2 = "";
            try {
              const v3 = w2.cssRules.length;
              for (let N2 = 0; N2 < v3; ++N2)
                typeof w2.cssRules[N2].cssText == "string" && (S2 += `${w2.cssRules[N2].cssText}\r
`);
            } catch (v3) {
              f3({
                messages: [
                  "A stylesheet could not be accessed. This is likely due to the stylesheet having cross-origin imports, and many browsers block script access to cross-origin stylesheets. See https://github.com/MatthewHerbst/react-to-print/issues/429 for details. You may be able to load the sheet by both marking the stylesheet with the cross `crossorigin` attribute, and setting the `Access-Control-Allow-Origin` header on the server serving the stylesheet. Alternatively, host the stylesheet on your domain to avoid this issue entirely.",
                  // eslint-disable-line max-len
                  r,
                  `Original error: ${P2(v3).message}`
                ],
                level: "warning"
              });
            }
            u2.setAttribute("id", `react-to-print-${o2}`), T && u2.setAttribute("nonce", T), u2.appendChild(d2.createTextNode(S2)), d2.head.appendChild(u2);
          }
        } else if (r.getAttribute("href"))
          if (r.hasAttribute("disabled"))
            f3({
              messages: ["`react-to-print` encountered a <link> tag with a `disabled` attribute and will ignore it. Note that the `disabled` attribute is deprecated, and some browsers ignore it. You should stop using it. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-disabled. The <link> is:", r],
              level: "warning"
            }), i2(r);
          else {
            const u2 = d2.createElement(r.tagName);
            for (let w2 = 0, S2 = r.attributes.length; w2 < S2; ++w2) {
              const v3 = r.attributes[w2];
              v3 && u2.setAttribute(v3.nodeName, v3.nodeValue ?? "");
            }
            u2.onload = () => {
              i2(u2);
            }, u2.onerror = (w2, S2, v3, N2, I) => {
              i2(u2, ["Failed to load", u2, "Error:", I]);
            }, T && u2.setAttribute("nonce", T), d2.head.appendChild(u2);
          }
        else
          f3({
            messages: ["`react-to-print` encountered a <link> tag with an empty `href` attribute. In addition to being invalid HTML, this can cause problems in many browsers, and so the <link> was not loaded. The <link> is:", r],
            level: "warning"
          }), i2(r);
      }
    }
  }
  g2 === 0 && H2(e2, n3);
}
function J(e2, t2, n3) {
  e2.onload = () => {
    W2(
      e2,
      t2,
      n3
    );
  }, document.body.appendChild(e2);
}
function K({ contentRef: e2, optionalContent: t2, suppressErrors: n3 }) {
  if (t2 && typeof t2 == "function")
    return e2 && f3({
      level: "warning",
      messages: ['"react-to-print" received a `contentRef` option and an optional-content param passed to its callback. The `contentRef` option will be ignored.']
    }), t2();
  if (e2)
    return e2.current;
  f3({
    messages: ['"react-to-print" did not receive a `contentRef` option or a optional-content param pass to its callback.'],
    suppressErrors: n3
  });
}
function Q2(e2, t2) {
  const {
    contentRef: n3,
    fonts: l2,
    ignoreGlobalStyles: p2,
    suppressErrors: m2
  } = t2, h3 = K({
    contentRef: n3,
    optionalContent: e2,
    suppressErrors: m2
  });
  if (!h3)
    return;
  const g2 = h3.cloneNode(true), a2 = document.querySelectorAll("link[rel~='stylesheet'], link[as='style']"), c2 = g2.querySelectorAll("img"), E2 = g2.querySelectorAll("video"), y2 = l2 ? l2.length : 0, C2 = (p2 ? 0 : a2.length) + c2.length + E2.length + y2;
  return {
    contentNode: h3,
    clonedContentNode: g2,
    clonedImgNodes: c2,
    clonedVideoNodes: E2,
    numResourcesToLoad: C2,
    originalCanvasNodes: h3.querySelectorAll("canvas")
  };
}
function Z2({
  bodyClass: e2,
  contentRef: t2,
  copyShadowRoots: n3,
  documentTitle: l2,
  fonts: p2,
  ignoreGlobalStyles: m2,
  nonce: h3,
  onAfterPrint: g2,
  onBeforePrint: a2,
  onPrintError: c2,
  pageStyle: E2,
  preserveAfterPrint: y2,
  print: C2,
  printIframeProps: T,
  suppressErrors: A2
}) {
  return (0, import_react26.useCallback)((L2) => {
    $2(y2, true);
    function _2() {
      const i2 = {
        bodyClass: e2,
        contentRef: t2,
        copyShadowRoots: n3,
        documentTitle: l2,
        fonts: p2,
        ignoreGlobalStyles: m2,
        nonce: h3,
        onAfterPrint: g2,
        onPrintError: c2,
        pageStyle: E2,
        preserveAfterPrint: y2,
        print: C2,
        suppressErrors: A2
      }, d2 = V(T), k2 = Q2(L2, i2);
      if (!k2) {
        f3({
          messages: ["There is nothing to print"],
          suppressErrors: A2
        });
        return;
      }
      J(d2, k2, i2);
    }
    a2 ? a2().then(() => {
      _2();
    }).catch((i2) => {
      c2?.("onBeforePrint", P2(i2));
    }) : _2();
  }, [
    e2,
    t2,
    n3,
    l2,
    p2,
    m2,
    h3,
    g2,
    a2,
    c2,
    E2,
    y2,
    T,
    C2,
    A2
  ]);
}

// src/components/InvoicePrint.tsx
function InvoicePrint({ order, onClose }) {
  const printRef = (0, import_react27.useRef)(null);
  const handlePrint = Z2({
    contentRef: printRef,
    onAfterPrint: onClose
  });
  const subtotal = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const deliveryFee = order.deliveryFee || 0;
  const total = order.total || subtotal + deliveryFee;
  const isPaid = order.paymentStatus === "paid";
  const paymentMethod = order.paymentMethod || "cash";
  return /* @__PURE__ */ import_react27.default.createElement("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4" }, /* @__PURE__ */ import_react27.default.createElement("div", { className: "bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ import_react27.default.createElement("div", { className: "bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 sm:p-6 rounded-t-2xl" }, /* @__PURE__ */ import_react27.default.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" }, /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("h2", { className: "text-xl sm:text-2xl font-bold" }, "\u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0637\u0644\u0628"), /* @__PURE__ */ import_react27.default.createElement("p", { className: "text-orange-100 text-xs sm:text-sm mt-1" }, "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: ", order.orderNumber)), /* @__PURE__ */ import_react27.default.createElement(
    "button",
    {
      onClick: handlePrint,
      className: "bg-white text-orange-600 px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2 text-sm sm:text-base"
    },
    /* @__PURE__ */ import_react27.default.createElement(Printer, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
    "\u0637\u0628\u0627\u0639\u0629"
  ))), /* @__PURE__ */ import_react27.default.createElement("div", { ref: printRef, className: "p-4 sm:p-6" }, /* @__PURE__ */ import_react27.default.createElement("div", { className: "bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6" }, /* @__PURE__ */ import_react27.default.createElement("h3", { className: "font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" }, /* @__PURE__ */ import_react27.default.createElement(Package, { className: "w-4 h-4 sm:w-5 sm:h-5 text-orange-600" }), "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631"), /* @__PURE__ */ import_react27.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm" }, /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("p", { className: "text-gray-500" }, "\u0627\u0633\u0645 \u0627\u0644\u0645\u062A\u062C\u0631"), /* @__PURE__ */ import_react27.default.createElement("p", { className: "font-semibold text-gray-900" }, order.storeInfo?.name || "\u2014")), /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("p", { className: "text-gray-500" }, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641"), /* @__PURE__ */ import_react27.default.createElement("p", { className: "font-semibold text-gray-900 flex items-center gap-1" }, /* @__PURE__ */ import_react27.default.createElement(Phone, { className: "w-3 h-3 sm:w-4 sm:h-4" }), order.storeInfo?.phone || "\u2014")), /* @__PURE__ */ import_react27.default.createElement("div", { className: "col-span-1 sm:col-span-2" }, /* @__PURE__ */ import_react27.default.createElement("p", { className: "text-gray-500" }, "\u0627\u0644\u0639\u0646\u0648\u0627\u0646"), /* @__PURE__ */ import_react27.default.createElement("p", { className: "font-semibold text-gray-900 flex items-center gap-1" }, /* @__PURE__ */ import_react27.default.createElement(MapPin, { className: "w-3 h-3 sm:w-4 sm:h-4" }), order.storeInfo?.address || "\u2014")))), /* @__PURE__ */ import_react27.default.createElement("div", { className: "bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6" }, /* @__PURE__ */ import_react27.default.createElement("h3", { className: "font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" }, /* @__PURE__ */ import_react27.default.createElement(User, { className: "w-4 h-4 sm:w-5 sm:h-5 text-orange-600" }), "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0644"), /* @__PURE__ */ import_react27.default.createElement("div", { className: "text-xs sm:text-sm" }, /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("p", { className: "text-gray-500" }, "\u0627\u0644\u0627\u0633\u0645"), /* @__PURE__ */ import_react27.default.createElement("p", { className: "font-semibold text-gray-900" }, order.customerInfo?.fullName || "\u2014")))), /* @__PURE__ */ import_react27.default.createElement("div", { className: "bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6" }, /* @__PURE__ */ import_react27.default.createElement("div", { className: "flex items-center gap-2 text-xs sm:text-sm" }, /* @__PURE__ */ import_react27.default.createElement(Calendar, { className: "w-4 h-4 sm:w-5 sm:h-5 text-orange-600" }), /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("p", { className: "text-gray-500" }, "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0644\u0628"), /* @__PURE__ */ import_react27.default.createElement("p", { className: "font-semibold text-gray-900" }, new Date(order._creationTime).toLocaleString("ar-EG"))))), /* @__PURE__ */ import_react27.default.createElement("div", { className: "mb-4 sm:mb-6" }, /* @__PURE__ */ import_react27.default.createElement("h3", { className: "font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" }, /* @__PURE__ */ import_react27.default.createElement(Package, { className: "w-4 h-4 sm:w-5 sm:h-5 text-orange-600" }), "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A"), /* @__PURE__ */ import_react27.default.createElement("div", { className: "border border-gray-200 rounded-xl overflow-hidden" }, /* @__PURE__ */ import_react27.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react27.default.createElement("table", { className: "w-full min-w-[400px]" }, /* @__PURE__ */ import_react27.default.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ import_react27.default.createElement("tr", null, /* @__PURE__ */ import_react27.default.createElement("th", { className: "px-2 sm:px-4 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0627\u0644\u0645\u0646\u062A\u062C"), /* @__PURE__ */ import_react27.default.createElement("th", { className: "px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0627\u0644\u0643\u0645\u064A\u0629"), /* @__PURE__ */ import_react27.default.createElement("th", { className: "px-2 sm:px-4 py-2 sm:py-3 text-end text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0627\u0644\u0633\u0639\u0631"), /* @__PURE__ */ import_react27.default.createElement("th", { className: "px-2 sm:px-4 py-2 sm:py-3 text-end text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"))), /* @__PURE__ */ import_react27.default.createElement("tbody", { className: "divide-y divide-gray-100" }, order.items?.map((item, index) => /* @__PURE__ */ import_react27.default.createElement("tr", { key: index }, /* @__PURE__ */ import_react27.default.createElement("td", { className: "px-2 sm:px-4 py-2 sm:py-3" }, /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("p", { className: "font-medium text-gray-900 text-xs sm:text-sm" }, item.nameAr), (item.color || item.selectedSize) && /* @__PURE__ */ import_react27.default.createElement("div", { className: "flex gap-1 sm:gap-2 mt-1" }, item.color && /* @__PURE__ */ import_react27.default.createElement("span", { className: "text-[10px] sm:text-xs bg-purple-100 text-purple-700 px-1.5 sm:px-2 py-0.5 rounded" }, item.color), item.selectedSize && /* @__PURE__ */ import_react27.default.createElement("span", { className: "text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 rounded" }, item.selectedSize)))), /* @__PURE__ */ import_react27.default.createElement("td", { className: "px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm text-gray-600" }, item.quantity), /* @__PURE__ */ import_react27.default.createElement("td", { className: "px-2 sm:px-4 py-2 sm:py-3 text-end text-xs sm:text-sm text-gray-600" }, item.price, " EGP"), /* @__PURE__ */ import_react27.default.createElement("td", { className: "px-2 sm:px-4 py-2 sm:py-3 text-end text-xs sm:text-sm font-bold text-gray-900" }, (item.price * item.quantity).toFixed(2), " EGP")))))))), /* @__PURE__ */ import_react27.default.createElement("div", { className: "bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-orange-200" }, /* @__PURE__ */ import_react27.default.createElement("h3", { className: "font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base" }, /* @__PURE__ */ import_react27.default.createElement(DollarSign, { className: "w-4 h-4 sm:w-5 sm:h-5 text-orange-600" }), "\u0627\u0644\u0645\u0644\u062E\u0635 \u0627\u0644\u0645\u0627\u0644\u064A"), /* @__PURE__ */ import_react27.default.createElement("div", { className: "space-y-2 sm:space-y-3" }, /* @__PURE__ */ import_react27.default.createElement("div", { className: "flex justify-between items-center text-xs sm:text-sm" }, /* @__PURE__ */ import_react27.default.createElement("span", { className: "text-gray-600" }, "\u0633\u0639\u0631 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A"), /* @__PURE__ */ import_react27.default.createElement("span", { className: "font-semibold text-gray-900" }, subtotal.toFixed(2), " EGP")), /* @__PURE__ */ import_react27.default.createElement("div", { className: "flex justify-between items-center text-xs sm:text-sm" }, /* @__PURE__ */ import_react27.default.createElement("span", { className: "text-gray-600 flex items-center gap-1 sm:gap-2" }, /* @__PURE__ */ import_react27.default.createElement(Truck, { className: "w-3 h-3 sm:w-4 sm:h-4" }), "\u0633\u0639\u0631 \u0627\u0644\u062A\u0648\u0635\u064A\u0644"), /* @__PURE__ */ import_react27.default.createElement("span", { className: "font-semibold text-gray-900" }, deliveryFee.toFixed(2), " EGP")), /* @__PURE__ */ import_react27.default.createElement("div", { className: "border-t border-orange-200 pt-2 sm:pt-3 mt-2 sm:mt-3" }, /* @__PURE__ */ import_react27.default.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ import_react27.default.createElement("span", { className: "text-base sm:text-lg font-bold text-gray-900" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0646\u0647\u0627\u0626\u064A"), /* @__PURE__ */ import_react27.default.createElement("span", { className: "text-lg sm:text-2xl font-bold text-orange-600" }, total.toFixed(2), " EGP"))))), /* @__PURE__ */ import_react27.default.createElement("div", { className: "bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6" }, /* @__PURE__ */ import_react27.default.createElement("h3", { className: "font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" }, /* @__PURE__ */ import_react27.default.createElement(CreditCard, { className: "w-4 h-4 sm:w-5 sm:h-5 text-orange-600" }), "\u062D\u0627\u0644\u0629 \u0627\u0644\u062F\u0641\u0639"), /* @__PURE__ */ import_react27.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm" }, /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("p", { className: "text-gray-500" }, "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639"), /* @__PURE__ */ import_react27.default.createElement("p", { className: "font-semibold text-gray-900" }, paymentMethod === "cash" ? "\u0646\u0642\u062F\u064A" : paymentMethod === "card" ? "\u0628\u0637\u0627\u0642\u0629" : paymentMethod)), /* @__PURE__ */ import_react27.default.createElement("div", null, /* @__PURE__ */ import_react27.default.createElement("p", { className: "text-gray-500" }, "\u062D\u0627\u0644\u0629 \u0627\u0644\u062F\u0641\u0639"), /* @__PURE__ */ import_react27.default.createElement("span", { className: `inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}` }, isPaid ? "\u0645\u062F\u0641\u0648\u0639" : "\u063A\u064A\u0631 \u0645\u062F\u0641\u0648\u0639")))), /* @__PURE__ */ import_react27.default.createElement("div", { className: "bg-gray-50 rounded-xl p-3 sm:p-4" }, /* @__PURE__ */ import_react27.default.createElement("p", { className: "text-gray-500 text-xs sm:text-sm mb-1" }, "\u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628"), /* @__PURE__ */ import_react27.default.createElement("span", { className: `inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-sm font-semibold ${order.status === "delivered" ? "bg-green-100 text-green-700" : order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}` }, order.status === "pending" && "\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631", order.status === "confirmed" && "\u0645\u0624\u0643\u062F", order.status === "preparing" && "\u0642\u064A\u062F \u0627\u0644\u062A\u062D\u0636\u064A\u0631", order.status === "ready" && "\u062C\u0627\u0647\u0632", order.status === "delivering" && "\u0642\u064A\u062F \u0627\u0644\u062A\u0648\u0635\u064A\u0644", order.status === "delivered" && "\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644", order.status === "cancelled" && "\u0645\u0644\u063A\u064A"))), /* @__PURE__ */ import_react27.default.createElement("div", { className: "bg-gray-50 p-3 sm:p-4 rounded-b-2xl flex gap-2 sm:gap-3" }, /* @__PURE__ */ import_react27.default.createElement(
    "button",
    {
      onClick: handlePrint,
      className: "flex-1 bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
    },
    /* @__PURE__ */ import_react27.default.createElement(Printer, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
    "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629"
  ), /* @__PURE__ */ import_react27.default.createElement(
    "button",
    {
      onClick: onClose,
      className: "flex-1 bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-xs sm:text-sm"
    },
    "\u0625\u063A\u0644\u0627\u0642"
  ))));
}

// node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs
var React13 = __toESM(require_react(), 1);
var React22 = __toESM(require_react(), 1);
var React32 = __toESM(require_react(), 1);
var React42 = __toESM(require_react(), 1);
var React92 = __toESM(require_react(), 1);
var React82 = __toESM(require_react(), 1);
var React72 = __toESM(require_react(), 1);
var React62 = __toESM(require_react(), 1);
var React52 = __toESM(require_react(), 1);
var React102 = __toESM(require_react(), 1);
var React112 = __toESM(require_react(), 1);
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e2) {
    }
  }
}
function createPath({
  pathname = "/",
  search = "",
  hash = ""
}) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
var _map;
_map = /* @__PURE__ */ new WeakMap();
function matchRoutes(routes, locationArg, basename = "/") {
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i2 = 0; matches == null && i2 < branches.length; ++i2) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(
      branches[i2],
      decoded,
      allowPartial
    );
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let { route, pathname, params } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    loaderData: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = "", _hasParentOptionalSegments = false) {
  let flattenRoute = (route, index, hasParentOptionalSegments = _hasParentOptionalSegments, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      if (!meta.relativePath.startsWith(parentPath) && hasParentOptionalSegments) {
        return;
      }
      invariant(
        meta.relativePath.startsWith(parentPath),
        `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        `Index routes must not have child routes. Please remove all child routes from route path "${path}".`
      );
      flattenRoutes(
        route.children,
        branches,
        routesMeta,
        path,
        hasParentOptionalSegments
      );
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    if (route.path === "" || !route.path?.includes("?")) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, true, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(
    ...restExploded.map(
      (subpath) => subpath === "" ? required : [required, subpath].join("/")
    )
  );
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map(
    (exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded
  );
}
function rankRouteBranches(branches) {
  branches.sort(
    (a2, b3) => a2.score !== b3.score ? b3.score - a2.score : compareIndexes(
      a2.routesMeta.map((meta) => meta.childrenIndex),
      b3.routesMeta.map((meta) => meta.childrenIndex)
    )
  );
}
var paramRe = /^:[\w-]+$/;
var dynamicSegmentValue = 3;
var indexRouteValue = 2;
var emptySegmentValue = 1;
var staticSegmentValue = 10;
var splatPenalty = -2;
var isSplat = (s2) => s2 === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s2) => !isSplat(s2)).reduce(
    (score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue),
    initialScore
  );
}
function compareIndexes(a2, b3) {
  let siblings = a2.length === b3.length && a2.slice(0, -1).every((n3, i2) => n3 === b3[i2]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a2[a2.length - 1] - b3[b3.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
  let { routesMeta } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i2 = 0; i2 < routesMeta.length; ++i2) {
    let meta = routesMeta[i2];
    let end = i2 === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
      remainingPathname
    );
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath(
        {
          path: meta.relativePath,
          caseSensitive: meta.caseSensitive,
          end: false
        },
        remainingPathname
      );
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(
        joinPaths([matchedPathname, match.pathnameBase])
      ),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }
  let [matcher, compiledParams] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce(
    (memo22, { paramName, isOptional }, index) => {
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      const value = captureGroups[index];
      if (isOptional && !value) {
        memo22[paramName] = void 0;
      } else {
        memo22[paramName] = (value || "").replace(/%2F/g, "/");
      }
      return memo22;
    },
    {}
  );
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive = false, end = true) {
  warning(
    path === "*" || !path.endsWith("*") || path.endsWith("/*"),
    `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`
  );
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (_2, paramName, isOptional) => {
      params.push({ paramName, isOptional: isOptional != null });
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  if (path.endsWith("*")) {
    params.push({ paramName: "*" });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else {
  }
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v3) => decodeURIComponent(v3).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(
      false,
      `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`
    );
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
var ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function resolvePath(to, fromPathname = "/") {
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    toPathname = toPathname.replace(/\/\/+/g, "/");
    if (toPathname.startsWith("/")) {
      pathname = resolvePathname(toPathname.substring(1), "/");
    } else {
      pathname = resolvePathname(toPathname, fromPathname);
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(
    path
  )}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
  return matches.filter(
    (match, index) => index === 0 || match.route.path && match.route.path.length > 0
  );
}
function getResolveToMatches(matches) {
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches.map(
    (match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase
  );
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = { ...toArg };
    invariant(
      !to.pathname || !to.pathname.includes("?"),
      getInvalidPathError("?", "pathname", "search", to)
    );
    invariant(
      !to.pathname || !to.pathname.includes("#"),
      getInvalidPathError("#", "pathname", "hash", to)
    );
    invariant(
      !to.search || !to.search.includes("#"),
      getInvalidPathError("#", "search", "hash", to)
    );
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
var joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
var normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
var ErrorResponseImpl = class {
  constructor(status, statusText, data2, internal = false) {
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data2 instanceof Error) {
      this.data = data2.toString();
      this.error = data2;
    } else {
      this.data = data2;
    }
  }
};
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
function getRoutePattern(matches) {
  return matches.map((m2) => m2.route.path).filter(Boolean).join("/").replace(/\/\/*/g, "/") || "/";
}
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
function parseToInfo(_to, basename) {
  let to = _to;
  if (typeof to !== "string" || !ABSOLUTE_URL_REGEX.test(to)) {
    return {
      absoluteURL: void 0,
      isExternal: false,
      to
    };
  }
  let absoluteURL = to;
  let isExternal = false;
  if (isBrowser) {
    try {
      let currentUrl = new URL(window.location.href);
      let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
      let path = stripBasename(targetUrl.pathname, basename);
      if (targetUrl.origin === currentUrl.origin && path != null) {
        to = path + targetUrl.search + targetUrl.hash;
      } else {
        isExternal = true;
      }
    } catch (e2) {
      warning(
        false,
        `<Link to="${to}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  }
  return {
    absoluteURL,
    isExternal,
    to
  };
}
var UninstrumentedSymbol = Symbol("Uninstrumented");
var objectProtoNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var validMutationMethodsArr = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
var validMutationMethods = new Set(
  validMutationMethodsArr
);
var validRequestMethodsArr = [
  "GET",
  ...validMutationMethodsArr
];
var validRequestMethods = new Set(validRequestMethodsArr);
var ResetLoaderDataSymbol = Symbol("ResetLoaderData");
var DataRouterContext = React13.createContext(null);
DataRouterContext.displayName = "DataRouter";
var DataRouterStateContext = React13.createContext(null);
DataRouterStateContext.displayName = "DataRouterState";
var RSCRouterContext = React13.createContext(false);
var ViewTransitionContext = React13.createContext({
  isTransitioning: false
});
ViewTransitionContext.displayName = "ViewTransition";
var FetchersContext = React13.createContext(
  /* @__PURE__ */ new Map()
);
FetchersContext.displayName = "Fetchers";
var AwaitContext = React13.createContext(null);
AwaitContext.displayName = "Await";
var NavigationContext = React13.createContext(
  null
);
NavigationContext.displayName = "Navigation";
var LocationContext = React13.createContext(
  null
);
LocationContext.displayName = "Location";
var RouteContext = React13.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
RouteContext.displayName = "Route";
var RouteErrorContext = React13.createContext(null);
RouteErrorContext.displayName = "RouteError";
var ENABLE_DEV_WARNINGS = true;
var ERROR_DIGEST_BASE = "REACT_ROUTER_ERROR";
var ERROR_DIGEST_REDIRECT = "REDIRECT";
var ERROR_DIGEST_ROUTE_ERROR_RESPONSE = "ROUTE_ERROR_RESPONSE";
function decodeRedirectErrorDigest(digest) {
  if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_REDIRECT}:{`)) {
    try {
      let parsed = JSON.parse(digest.slice(28));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string" && typeof parsed.location === "string" && typeof parsed.reloadDocument === "boolean" && typeof parsed.replace === "boolean") {
        return parsed;
      }
    } catch {
    }
  }
}
function decodeRouteErrorResponseDigest(digest) {
  if (digest.startsWith(
    `${ERROR_DIGEST_BASE}:${ERROR_DIGEST_ROUTE_ERROR_RESPONSE}:{`
  )) {
    try {
      let parsed = JSON.parse(digest.slice(40));
      if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string") {
        return new ErrorResponseImpl(
          parsed.status,
          parsed.statusText,
          parsed.data
        );
      }
    } catch {
    }
  }
}
function useHref(to, { relative } = {}) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useHref() may be used only in the context of a <Router> component.`
  );
  let { basename, navigator: navigator2 } = React22.useContext(NavigationContext);
  let { hash, pathname, search } = useResolvedPath(to, { relative });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({ pathname: joinedPathname, search, hash });
}
function useInRouterContext() {
  return React22.useContext(LocationContext) != null;
}
function useLocation() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useLocation() may be used only in the context of a <Router> component.`
  );
  return React22.useContext(LocationContext).location;
}
var navigateEffectWarning = `You should call navigate() in a React.useEffect(), not when your component is first rendered.`;
function useIsomorphicLayoutEffect(cb) {
  let isStatic = React22.useContext(NavigationContext).static;
  if (!isStatic) {
    React22.useLayoutEffect(cb);
  }
}
function useNavigate() {
  let { isDataRoute } = React22.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );
  let dataRouterContext = React22.useContext(DataRouterContext);
  let { basename, navigator: navigator2 } = React22.useContext(NavigationContext);
  let { matches } = React22.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  let activeRef = React22.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React22.useCallback(
    (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        navigator2.go(to);
        return;
      }
      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname,
        options.relative === "path"
      );
      if (dataRouterContext == null && basename !== "/") {
        path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
      }
      (!!options.replace ? navigator2.replace : navigator2.push)(
        path,
        options.state,
        options
      );
    },
    [
      basename,
      navigator2,
      routePathnamesJson,
      locationPathname,
      dataRouterContext
    ]
  );
  return navigate;
}
var OutletContext = React22.createContext(null);
function useResolvedPath(to, { relative } = {}) {
  let { matches } = React22.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
  return React22.useMemo(
    () => resolveTo(
      to,
      JSON.parse(routePathnamesJson),
      locationPathname,
      relative === "path"
    ),
    [to, routePathnamesJson, locationPathname, relative]
  );
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, onError, future) {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`
  );
  let { navigator: navigator2 } = React22.useContext(NavigationContext);
  let { matches: parentMatches } = React22.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  if (ENABLE_DEV_WARNINGS) {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(
      parentPathname,
      !parentRoute || parentPath.endsWith("*") || parentPath.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${parentPathname}" (under <Route path="${parentPath}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${parentPath}"> to <Route path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`
    );
  }
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    invariant(
      parentPathnameBase === "/" || parsedLocationArg.pathname?.startsWith(parentPathnameBase),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${parentPathnameBase}" but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`
    );
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, { pathname: remainingPathname });
  if (ENABLE_DEV_WARNINGS) {
    warning(
      parentRoute || matches != null,
      `No routes matched location "${location.pathname}${location.search}${location.hash}" `
    );
    warning(
      matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
    );
  }
  let renderedMatches = _renderMatches(
    matches && matches.map(
      (match) => Object.assign({}, match, {
        params: Object.assign({}, parentParams, match.params),
        pathname: joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          navigator2.encodeLocation ? navigator2.encodeLocation(
            match.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : match.pathname
        ]),
        pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
          parentPathnameBase,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          navigator2.encodeLocation ? navigator2.encodeLocation(
            match.pathnameBase.replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : match.pathnameBase
        ])
      })
    ),
    parentMatches,
    dataRouterState,
    onError,
    future
  );
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ React22.createElement(
      LocationContext.Provider,
      {
        value: {
          location: {
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default",
            ...location
          },
          navigationType: "POP"
          /* Pop */
        }
      },
      renderedMatches
    );
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = { padding: "0.5rem", backgroundColor: lightgrey };
  let codeStyles = { padding: "2px 4px", backgroundColor: lightgrey };
  let devInfo = null;
  if (ENABLE_DEV_WARNINGS) {
    console.error(
      "Error handled by React Router default ErrorBoundary:",
      error
    );
    devInfo = /* @__PURE__ */ React22.createElement(React22.Fragment, null, /* @__PURE__ */ React22.createElement("p", null, "\u{1F4BF} Hey developer \u{1F44B}"), /* @__PURE__ */ React22.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ React22.createElement("code", { style: codeStyles }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ React22.createElement("code", { style: codeStyles }, "errorElement"), " prop on your route."));
  }
  return /* @__PURE__ */ React22.createElement(React22.Fragment, null, /* @__PURE__ */ React22.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ React22.createElement("h3", { style: { fontStyle: "italic" } }, message), stack ? /* @__PURE__ */ React22.createElement("pre", { style: preStyles }, stack) : null, devInfo);
}
var defaultErrorElement = /* @__PURE__ */ React22.createElement(DefaultErrorComponent, null);
var RenderErrorBoundary = class extends React22.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error(
        "React Router caught the following error during render",
        error
      );
    }
  }
  render() {
    let error = this.state.error;
    if (this.context && typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
      const decoded = decodeRouteErrorResponseDigest(error.digest);
      if (decoded) error = decoded;
    }
    let result = error !== void 0 ? /* @__PURE__ */ React22.createElement(RouteContext.Provider, { value: this.props.routeContext }, /* @__PURE__ */ React22.createElement(
      RouteErrorContext.Provider,
      {
        value: error,
        children: this.props.component
      }
    )) : this.props.children;
    if (this.context) {
      return /* @__PURE__ */ React22.createElement(RSCErrorHandler, { error }, result);
    }
    return result;
  }
};
RenderErrorBoundary.contextType = RSCRouterContext;
var errorRedirectHandledMap = /* @__PURE__ */ new WeakMap();
function RSCErrorHandler({
  children,
  error
}) {
  let { basename } = React22.useContext(NavigationContext);
  if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
    let redirect2 = decodeRedirectErrorDigest(error.digest);
    if (redirect2) {
      let existingRedirect = errorRedirectHandledMap.get(error);
      if (existingRedirect) throw existingRedirect;
      let parsed = parseToInfo(redirect2.location, basename);
      if (isBrowser && !errorRedirectHandledMap.get(error)) {
        if (parsed.isExternal || redirect2.reloadDocument) {
          window.location.href = parsed.absoluteURL || parsed.to;
        } else {
          const redirectPromise = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(parsed.to, {
              replace: redirect2.replace
            })
          );
          errorRedirectHandledMap.set(error, redirectPromise);
          throw redirectPromise;
        }
      }
      return /* @__PURE__ */ React22.createElement(
        "meta",
        {
          httpEquiv: "refresh",
          content: `0;url=${parsed.absoluteURL || parsed.to}`
        }
      );
    }
  }
  return children;
}
function RenderedRoute({ routeContext, match, children }) {
  let dataRouterContext = React22.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ React22.createElement(RouteContext.Provider, { value: routeContext }, children);
}
function _renderMatches(matches, parentMatches = [], dataRouterState = null, onErrorHandler = null, future = null) {
  if (matches == null) {
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if (parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = dataRouterState?.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(
      (m2) => m2.route.id && errors?.[m2.route.id] !== void 0
    );
    invariant(
      errorIndex >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        errors
      ).join(",")}`
    );
    renderedMatches = renderedMatches.slice(
      0,
      Math.min(renderedMatches.length, errorIndex + 1)
    );
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState) {
    for (let i2 = 0; i2 < renderedMatches.length; i2++) {
      let match = renderedMatches[i2];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i2;
      }
      if (match.route.id) {
        let { loaderData, errors: errors2 } = dataRouterState;
        let needsToRunLoader = match.route.loader && !loaderData.hasOwnProperty(match.route.id) && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  let onError = dataRouterState && onErrorHandler ? (error, errorInfo) => {
    onErrorHandler(error, {
      location: dataRouterState.location,
      params: dataRouterState.matches?.[0]?.params ?? {},
      unstable_pattern: getRoutePattern(dataRouterState.matches),
      errorInfo
    });
  } : void 0;
  return renderedMatches.reduceRight(
    (outlet, match, index) => {
      let error;
      let shouldRenderHydrateFallback = false;
      let errorElement = null;
      let hydrateFallbackElement = null;
      if (dataRouterState) {
        error = errors && match.route.id ? errors[match.route.id] : void 0;
        errorElement = match.route.errorElement || defaultErrorElement;
        if (renderFallback) {
          if (fallbackIndex < 0 && index === 0) {
            warningOnce(
              "route-fallback",
              false,
              "No `HydrateFallback` element provided to render during initial hydration"
            );
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = null;
          } else if (fallbackIndex === index) {
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = match.route.hydrateFallbackElement || null;
          }
        }
      }
      let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
      let getChildren = () => {
        let children;
        if (error) {
          children = errorElement;
        } else if (shouldRenderHydrateFallback) {
          children = hydrateFallbackElement;
        } else if (match.route.Component) {
          children = /* @__PURE__ */ React22.createElement(match.route.Component, null);
        } else if (match.route.element) {
          children = match.route.element;
        } else {
          children = outlet;
        }
        return /* @__PURE__ */ React22.createElement(
          RenderedRoute,
          {
            match,
            routeContext: {
              outlet,
              matches: matches2,
              isDataRoute: dataRouterState != null
            },
            children
          }
        );
      };
      return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ React22.createElement(
        RenderErrorBoundary,
        {
          location: dataRouterState.location,
          revalidation: dataRouterState.revalidation,
          component: errorElement,
          error,
          children: getChildren(),
          routeContext: { outlet: null, matches: matches2, isDataRoute: true },
          onError
        }
      ) : getChildren();
    },
    null
  );
}
function getDataRouterConsoleError(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext(hookName) {
  let ctx = React22.useContext(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError(hookName));
  return ctx;
}
function useDataRouterState(hookName) {
  let state = React22.useContext(DataRouterStateContext);
  invariant(state, getDataRouterConsoleError(hookName));
  return state;
}
function useRouteContext(hookName) {
  let route = React22.useContext(RouteContext);
  invariant(route, getDataRouterConsoleError(hookName));
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  invariant(
    thisRoute.route.id,
    `${hookName} can only be used on routes that contain a unique "id"`
  );
  return thisRoute.route.id;
}
function useRouteId() {
  return useCurrentRouteId(
    "useRouteId"
    /* UseRouteId */
  );
}
function useNavigation() {
  let state = useDataRouterState(
    "useNavigation"
    /* UseNavigation */
  );
  return state.navigation;
}
function useMatches() {
  let { matches, loaderData } = useDataRouterState(
    "useMatches"
    /* UseMatches */
  );
  return React22.useMemo(
    () => matches.map((m2) => convertRouteMatchToUiMatch(m2, loaderData)),
    [matches, loaderData]
  );
}
function useRouteError() {
  let error = React22.useContext(RouteErrorContext);
  let state = useDataRouterState(
    "useRouteError"
    /* UseRouteError */
  );
  let routeId = useCurrentRouteId(
    "useRouteError"
    /* UseRouteError */
  );
  if (error !== void 0) {
    return error;
  }
  return state.errors?.[routeId];
}
function useNavigateStable() {
  let { router } = useDataRouterContext(
    "useNavigate"
    /* UseNavigateStable */
  );
  let id = useCurrentRouteId(
    "useNavigate"
    /* UseNavigateStable */
  );
  let activeRef = React22.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React22.useCallback(
    async (to, options = {}) => {
      warning(activeRef.current, navigateEffectWarning);
      if (!activeRef.current) return;
      if (typeof to === "number") {
        await router.navigate(to);
      } else {
        await router.navigate(to, { fromRouteId: id, ...options });
      }
    },
    [router, id]
  );
  return navigate;
}
var alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    warning(false, message);
  }
}
var USE_OPTIMISTIC = "useOptimistic";
var useOptimisticImpl = React32[USE_OPTIMISTIC];
var MemoizedDataRoutes = React32.memo(DataRoutes);
function DataRoutes({
  routes,
  future,
  state,
  onError
}) {
  return useRoutesImpl(routes, void 0, state, onError, future);
}
function Route(props) {
  invariant(
    false,
    `A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.`
  );
}
function Router({
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  navigationType = "POP",
  navigator: navigator2,
  static: staticProp = false,
  unstable_useTransitions
}) {
  invariant(
    !useInRouterContext(),
    `You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`
  );
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = React32.useMemo(
    () => ({
      basename,
      navigator: navigator2,
      static: staticProp,
      unstable_useTransitions,
      future: {}
    }),
    [basename, navigator2, staticProp, unstable_useTransitions]
  );
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = React32.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  warning(
    locationContext != null,
    `<Router basename="${basename}"> is not able to match the URL "${pathname}${search}${hash}" because it does not start with the basename, so the <Router> won't render anything.`
  );
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ React32.createElement(NavigationContext.Provider, { value: navigationContext }, /* @__PURE__ */ React32.createElement(LocationContext.Provider, { children, value: locationContext }));
}
function Routes({
  children,
  location
}) {
  return useRoutes(createRoutesFromChildren(children), location);
}
function createRoutesFromChildren(children, parentPath = []) {
  let routes = [];
  React32.Children.forEach(children, (element, index) => {
    if (!React32.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === React32.Fragment) {
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children, treePath)
      );
      return;
    }
    invariant(
      element.type === Route,
      `[${typeof element.type === "string" ? element.type : element.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    );
    invariant(
      !element.props.index || !element.props.children,
      "An index route cannot have child routes."
    );
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      middleware: element.props.middleware,
      loader: element.props.loader,
      action: element.props.action,
      hydrateFallbackElement: element.props.hydrateFallbackElement,
      HydrateFallback: element.props.HydrateFallback,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.hasErrorBoundary === true || element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(
        element.props.children,
        treePath
      );
    }
    routes.push(route);
  });
  return routes;
}
var defaultMethod = "get";
var defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return typeof HTMLElement !== "undefined" && object instanceof HTMLElement;
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
var _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      );
      _formDataSupportsSubmitter = false;
    } catch (e2) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
var supportedFormEncTypes = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    warning(
      false,
      `"${encType}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${defaultEncType}"`
    );
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error(
        `Cannot submit a <button> or <input type="submit"> without a <form>`
      );
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let { name, type, value } = target;
      if (type === "image") {
        let prefix = name ? `${name}.` : "";
        formData.append(`${prefix}x`, "0");
        formData.append(`${prefix}y`, "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error(
      `Cannot submit element that is not <form>, <button>, or <input type="submit|image">`
    );
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = void 0;
  }
  return { action, method: method.toLowerCase(), encType, formData, body };
}
var objectProtoNames2 = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var ESCAPE_LOOKUP = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var ESCAPE_REGEX = /[&><\u2028\u2029]/g;
function escapeHtml(html) {
  return html.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
}
function invariant2(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
var SingleFetchRedirectSymbol = Symbol("SingleFetchRedirect");
function singleFetchUrl(reqUrl, basename, trailingSlashAware, extension) {
  let url = typeof reqUrl === "string" ? new URL(
    reqUrl,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window === "undefined" ? "server://singlefetch/" : window.location.origin
  ) : reqUrl;
  if (trailingSlashAware) {
    if (url.pathname.endsWith("/")) {
      url.pathname = `${url.pathname}_.${extension}`;
    } else {
      url.pathname = `${url.pathname}.${extension}`;
    }
  } else {
    if (url.pathname === "/") {
      url.pathname = `_root.${extension}`;
    } else if (basename && stripBasename(url.pathname, basename) === "/") {
      url.pathname = `${basename.replace(/\/$/, "")}/_root.${extension}`;
    } else {
      url.pathname = `${url.pathname.replace(/\/$/, "")}.${extension}`;
    }
  }
  return url;
}
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }
  try {
    let routeModule = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      route.module
    );
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {
    console.error(
      `Error loading route module \`${route.module}\`, reloading page...`
    );
    console.error(error);
    if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && // @ts-expect-error
    import.meta.hot) {
      throw error;
    }
    window.location.reload();
    return new Promise(() => {
    });
  }
}
function isPageLinkDescriptor(object) {
  return object != null && typeof object.page === "string";
}
function isHtmlLinkDescriptor(object) {
  if (object == null) {
    return false;
  }
  if (object.href == null) {
    return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
  }
  return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
  let links = await Promise.all(
    matches.map(async (match) => {
      let route = manifest.routes[match.route.id];
      if (route) {
        let mod = await loadRouteModule(route, routeModules);
        return mod.links ? mod.links() : [];
      }
      return [];
    })
  );
  return dedupeLinkDescriptors(
    links.flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map(
      (link) => link.rel === "stylesheet" ? { ...link, rel: "prefetch", as: "style" } : { ...link, rel: "prefetch" }
    )
  );
}
function getNewMatchesForLinks(page2, nextMatches, currentMatches, manifest, location, mode) {
  let isNew = (match, index) => {
    if (!currentMatches[index]) return true;
    return match.route.id !== currentMatches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    return (
      // param change, /users/123 -> /users/456
      currentMatches[index].pathname !== match.pathname || // splat param changed, which is not present in match.path
      // e.g. /files/images/avatar.jpg -> files/finances.xls
      currentMatches[index].route.path?.endsWith("*") && currentMatches[index].params["*"] !== match.params["*"]
    );
  };
  if (mode === "assets") {
    return nextMatches.filter(
      (match, index) => isNew(match, index) || matchPathChanged(match, index)
    );
  }
  if (mode === "data") {
    return nextMatches.filter((match, index) => {
      let manifestRoute = manifest.routes[match.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return false;
      }
      if (isNew(match, index) || matchPathChanged(match, index)) {
        return true;
      }
      if (match.route.shouldRevalidate) {
        let routeChoice = match.route.shouldRevalidate({
          currentUrl: new URL(
            location.pathname + location.search + location.hash,
            window.origin
          ),
          currentParams: currentMatches[0]?.params || {},
          nextUrl: new URL(page2, window.origin),
          nextParams: match.params,
          defaultShouldRevalidate: true
        });
        if (typeof routeChoice === "boolean") {
          return routeChoice;
        }
      }
      return true;
    });
  }
  return [];
}
function getModuleLinkHrefs(matches, manifest, { includeHydrateFallback } = {}) {
  return dedupeHrefs(
    matches.map((match) => {
      let route = manifest.routes[match.route.id];
      if (!route) return [];
      let hrefs = [route.module];
      if (route.clientActionModule) {
        hrefs = hrefs.concat(route.clientActionModule);
      }
      if (route.clientLoaderModule) {
        hrefs = hrefs.concat(route.clientLoaderModule);
      }
      if (includeHydrateFallback && route.hydrateFallbackModule) {
        hrefs = hrefs.concat(route.hydrateFallbackModule);
      }
      if (route.imports) {
        hrefs = hrefs.concat(route.imports);
      }
      return hrefs;
    }).flat(1)
  );
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function sortKeys(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set();
  let preloadsSet = new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    let alreadyModulePreload = preloads && !isPageLinkDescriptor(descriptor) && descriptor.as === "script" && descriptor.href && preloadsSet.has(descriptor.href);
    if (alreadyModulePreload) {
      return deduped;
    }
    let key = JSON.stringify(sortKeys(descriptor));
    if (!set.has(key)) {
      set.add(key);
      deduped.push({ key, link: descriptor });
    }
    return deduped;
  }, []);
}
function useDataRouterContext2() {
  let context = React82.useContext(DataRouterContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterContext.Provider> element"
  );
  return context;
}
function useDataRouterStateContext() {
  let context = React82.useContext(DataRouterStateContext);
  invariant2(
    context,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  );
  return context;
}
var FrameworkContext = React82.createContext(void 0);
FrameworkContext.displayName = "FrameworkContext";
function useFrameworkContext() {
  let context = React82.useContext(FrameworkContext);
  invariant2(
    context,
    "You must render this element inside a <HydratedRouter> element"
  );
  return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let frameworkContext = React82.useContext(FrameworkContext);
  let [maybePrefetch, setMaybePrefetch] = React82.useState(false);
  let [shouldPrefetch, setShouldPrefetch] = React82.useState(false);
  let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } = theirElementProps;
  let ref = React82.useRef(null);
  React82.useEffect(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
    if (prefetch === "viewport") {
      let callback = (entries) => {
        entries.forEach((entry) => {
          setShouldPrefetch(entry.isIntersecting);
        });
      };
      let observer = new IntersectionObserver(callback, { threshold: 0.5 });
      if (ref.current) observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [prefetch]);
  React82.useEffect(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);
  let setIntent = () => {
    setMaybePrefetch(true);
  };
  let cancelIntent = () => {
    setMaybePrefetch(false);
    setShouldPrefetch(false);
  };
  if (!frameworkContext) {
    return [false, ref, {}];
  }
  if (prefetch !== "intent") {
    return [shouldPrefetch, ref, {}];
  }
  return [
    shouldPrefetch,
    ref,
    {
      onFocus: composeEventHandlers(onFocus, setIntent),
      onBlur: composeEventHandlers(onBlur, cancelIntent),
      onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
      onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
      onTouchStart: composeEventHandlers(onTouchStart, setIntent)
    }
  ];
}
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
function PrefetchPageLinks({ page: page2, ...linkProps }) {
  let { router } = useDataRouterContext2();
  let matches = React82.useMemo(
    () => matchRoutes(router.routes, page2, router.basename),
    [router.routes, page2, router.basename]
  );
  if (!matches) {
    return null;
  }
  return /* @__PURE__ */ React82.createElement(PrefetchPageLinksImpl, { page: page2, matches, ...linkProps });
}
function useKeyedPrefetchLinks(matches) {
  let { manifest, routeModules } = useFrameworkContext();
  let [keyedPrefetchLinks, setKeyedPrefetchLinks] = React82.useState([]);
  React82.useEffect(() => {
    let interrupted = false;
    void getKeyedPrefetchLinks(matches, manifest, routeModules).then(
      (links) => {
        if (!interrupted) {
          setKeyedPrefetchLinks(links);
        }
      }
    );
    return () => {
      interrupted = true;
    };
  }, [matches, manifest, routeModules]);
  return keyedPrefetchLinks;
}
function PrefetchPageLinksImpl({
  page: page2,
  matches: nextMatches,
  ...linkProps
}) {
  let location = useLocation();
  let { future, manifest, routeModules } = useFrameworkContext();
  let { basename } = useDataRouterContext2();
  let { loaderData, matches } = useDataRouterStateContext();
  let newMatchesForData = React82.useMemo(
    () => getNewMatchesForLinks(
      page2,
      nextMatches,
      matches,
      manifest,
      location,
      "data"
    ),
    [page2, nextMatches, matches, manifest, location]
  );
  let newMatchesForAssets = React82.useMemo(
    () => getNewMatchesForLinks(
      page2,
      nextMatches,
      matches,
      manifest,
      location,
      "assets"
    ),
    [page2, nextMatches, matches, manifest, location]
  );
  let dataHrefs = React82.useMemo(() => {
    if (page2 === location.pathname + location.search + location.hash) {
      return [];
    }
    let routesParams = /* @__PURE__ */ new Set();
    let foundOptOutRoute = false;
    nextMatches.forEach((m2) => {
      let manifestRoute = manifest.routes[m2.route.id];
      if (!manifestRoute || !manifestRoute.hasLoader) {
        return;
      }
      if (!newMatchesForData.some((m22) => m22.route.id === m2.route.id) && m2.route.id in loaderData && routeModules[m2.route.id]?.shouldRevalidate) {
        foundOptOutRoute = true;
      } else if (manifestRoute.hasClientLoader) {
        foundOptOutRoute = true;
      } else {
        routesParams.add(m2.route.id);
      }
    });
    if (routesParams.size === 0) {
      return [];
    }
    let url = singleFetchUrl(
      page2,
      basename,
      future.unstable_trailingSlashAwareDataRequests,
      "data"
    );
    if (foundOptOutRoute && routesParams.size > 0) {
      url.searchParams.set(
        "_routes",
        nextMatches.filter((m2) => routesParams.has(m2.route.id)).map((m2) => m2.route.id).join(",")
      );
    }
    return [url.pathname + url.search];
  }, [
    basename,
    future.unstable_trailingSlashAwareDataRequests,
    loaderData,
    location,
    manifest,
    newMatchesForData,
    nextMatches,
    page2,
    routeModules
  ]);
  let moduleHrefs = React82.useMemo(
    () => getModuleLinkHrefs(newMatchesForAssets, manifest),
    [newMatchesForAssets, manifest]
  );
  let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
  return /* @__PURE__ */ React82.createElement(React82.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ React82.createElement("link", { key: href, rel: "prefetch", as: "fetch", href, ...linkProps })), moduleHrefs.map((href) => /* @__PURE__ */ React82.createElement("link", { key: href, rel: "modulepreload", href, ...linkProps })), keyedPrefetchLinks.map(({ key, link }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ React82.createElement(
      "link",
      {
        key,
        nonce: linkProps.nonce,
        ...link,
        crossOrigin: link.crossOrigin ?? linkProps.crossOrigin
      }
    )
  )));
}
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
var isBrowser2 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
try {
  if (isBrowser2) {
    window.__reactRouterVersion = // @ts-expect-error
    "7.13.0";
  }
} catch (e2) {
}
function HistoryRouter({
  basename,
  children,
  history,
  unstable_useTransitions
}) {
  let [state, setStateImpl] = React102.useState({
    action: history.action,
    location: history.location
  });
  let setState = React102.useCallback(
    (newState) => {
      if (unstable_useTransitions === false) {
        setStateImpl(newState);
      } else {
        React102.startTransition(() => setStateImpl(newState));
      }
    },
    [unstable_useTransitions]
  );
  React102.useLayoutEffect(() => history.listen(setState), [history, setState]);
  return /* @__PURE__ */ React102.createElement(
    Router,
    {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      unstable_useTransitions
    }
  );
}
HistoryRouter.displayName = "unstable_HistoryRouter";
var ABSOLUTE_URL_REGEX2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var Link = React102.forwardRef(
  function LinkWithRef({
    onClick,
    discover = "render",
    prefetch = "none",
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition,
    unstable_defaultShouldRevalidate,
    ...rest
  }, forwardedRef) {
    let { basename, unstable_useTransitions } = React102.useContext(NavigationContext);
    let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX2.test(to);
    let parsed = parseToInfo(to, basename);
    to = parsed.to;
    let href = useHref(to, { relative });
    let [shouldPrefetch, prefetchRef, prefetchHandlers] = usePrefetchBehavior(
      prefetch,
      rest
    );
    let internalOnClick = useLinkClickHandler(to, {
      replace: replace2,
      state,
      target,
      preventScrollReset,
      relative,
      viewTransition,
      unstable_defaultShouldRevalidate,
      unstable_useTransitions
    });
    function handleClick(event) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) {
        internalOnClick(event);
      }
    }
    let link = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ React102.createElement(
        "a",
        {
          ...rest,
          ...prefetchHandlers,
          href: parsed.absoluteURL || href,
          onClick: parsed.isExternal || reloadDocument ? onClick : handleClick,
          ref: mergeRefs(forwardedRef, prefetchRef),
          target,
          "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
        }
      )
    );
    return shouldPrefetch && !isAbsolute ? /* @__PURE__ */ React102.createElement(React102.Fragment, null, link, /* @__PURE__ */ React102.createElement(PrefetchPageLinks, { page: href })) : link;
  }
);
Link.displayName = "Link";
var NavLink = React102.forwardRef(
  function NavLinkWithRef({
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children,
    ...rest
  }, ref) {
    let path = useResolvedPath(to, { relative: rest.relative });
    let location = useLocation();
    let routerState = React102.useContext(DataRouterStateContext);
    let { navigator: navigator2, basename } = React102.useContext(NavigationContext);
    let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useViewTransitionState(path) && viewTransition === true;
    let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
    let locationPathname = location.pathname;
    let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
    if (!caseSensitive) {
      locationPathname = locationPathname.toLowerCase();
      nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
      toPathname = toPathname.toLowerCase();
    }
    if (nextLocationPathname && basename) {
      nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
    }
    const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
    let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
    let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
    let renderProps = {
      isActive,
      isPending,
      isTransitioning
    };
    let ariaCurrent = isActive ? ariaCurrentProp : void 0;
    let className;
    if (typeof classNameProp === "function") {
      className = classNameProp(renderProps);
    } else {
      className = [
        classNameProp,
        isActive ? "active" : null,
        isPending ? "pending" : null,
        isTransitioning ? "transitioning" : null
      ].filter(Boolean).join(" ");
    }
    let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
    return /* @__PURE__ */ React102.createElement(
      Link,
      {
        ...rest,
        "aria-current": ariaCurrent,
        className,
        ref,
        style,
        to,
        viewTransition
      },
      typeof children === "function" ? children(renderProps) : children
    );
  }
);
NavLink.displayName = "NavLink";
var Form = React102.forwardRef(
  ({
    discover = "render",
    fetcherKey,
    navigate,
    reloadDocument,
    replace: replace2,
    state,
    method = defaultMethod,
    action,
    onSubmit,
    relative,
    preventScrollReset,
    viewTransition,
    unstable_defaultShouldRevalidate,
    ...props
  }, forwardedRef) => {
    let { unstable_useTransitions } = React102.useContext(NavigationContext);
    let submit = useSubmit();
    let formAction = useFormAction(action, { relative });
    let formMethod = method.toLowerCase() === "get" ? "get" : "post";
    let isAbsolute = typeof action === "string" && ABSOLUTE_URL_REGEX2.test(action);
    let submitHandler = (event) => {
      onSubmit && onSubmit(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      let submitter = event.nativeEvent.submitter;
      let submitMethod = submitter?.getAttribute("formmethod") || method;
      let doSubmit = () => submit(submitter || event.currentTarget, {
        fetcherKey,
        method: submitMethod,
        navigate,
        replace: replace2,
        state,
        relative,
        preventScrollReset,
        viewTransition,
        unstable_defaultShouldRevalidate
      });
      if (unstable_useTransitions && navigate !== false) {
        React102.startTransition(() => doSubmit());
      } else {
        doSubmit();
      }
    };
    return /* @__PURE__ */ React102.createElement(
      "form",
      {
        ref: forwardedRef,
        method: formMethod,
        action: formAction,
        onSubmit: reloadDocument ? onSubmit : submitHandler,
        ...props,
        "data-discover": !isAbsolute && discover === "render" ? "true" : void 0
      }
    );
  }
);
Form.displayName = "Form";
function ScrollRestoration({
  getKey,
  storageKey,
  ...props
}) {
  let remixContext = React102.useContext(FrameworkContext);
  let { basename } = React102.useContext(NavigationContext);
  let location = useLocation();
  let matches = useMatches();
  useScrollRestoration({ getKey, storageKey });
  let ssrKey = React102.useMemo(
    () => {
      if (!remixContext || !getKey) return null;
      let userKey = getScrollRestorationKey(
        location,
        matches,
        basename,
        getKey
      );
      return userKey !== location.key ? userKey : null;
    },
    // Nah, we only need this the first time for the SSR render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (!remixContext || remixContext.isSpaMode) {
    return null;
  }
  let restoreScroll = ((storageKey2, restoreKey) => {
    if (!window.history.state || !window.history.state.key) {
      let key = Math.random().toString(32).slice(2);
      window.history.replaceState({ key }, "");
    }
    try {
      let positions = JSON.parse(sessionStorage.getItem(storageKey2) || "{}");
      let storedY = positions[restoreKey || window.history.state.key];
      if (typeof storedY === "number") {
        window.scrollTo(0, storedY);
      }
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem(storageKey2);
    }
  }).toString();
  return /* @__PURE__ */ React102.createElement(
    "script",
    {
      ...props,
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: {
        __html: `(${restoreScroll})(${escapeHtml(
          JSON.stringify(storageKey || SCROLL_RESTORATION_STORAGE_KEY)
        )}, ${escapeHtml(JSON.stringify(ssrKey))})`
      }
    }
  );
}
ScrollRestoration.displayName = "ScrollRestoration";
function getDataRouterConsoleError2(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext3(hookName) {
  let ctx = React102.useContext(DataRouterContext);
  invariant(ctx, getDataRouterConsoleError2(hookName));
  return ctx;
}
function useDataRouterState2(hookName) {
  let state = React102.useContext(DataRouterStateContext);
  invariant(state, getDataRouterConsoleError2(hookName));
  return state;
}
function useLinkClickHandler(to, {
  target,
  replace: replaceProp,
  state,
  preventScrollReset,
  relative,
  viewTransition,
  unstable_defaultShouldRevalidate,
  unstable_useTransitions
} = {}) {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, { relative });
  return React102.useCallback(
    (event) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();
        let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
        let doNavigate = () => navigate(to, {
          replace: replace2,
          state,
          preventScrollReset,
          relative,
          viewTransition,
          unstable_defaultShouldRevalidate
        });
        if (unstable_useTransitions) {
          React102.startTransition(() => doNavigate());
        } else {
          doNavigate();
        }
      }
    },
    [
      location,
      navigate,
      path,
      replaceProp,
      state,
      target,
      to,
      preventScrollReset,
      relative,
      viewTransition,
      unstable_defaultShouldRevalidate,
      unstable_useTransitions
    ]
  );
}
var fetcherId = 0;
var getUniqueFetcherId = () => `__${String(++fetcherId)}__`;
function useSubmit() {
  let { router } = useDataRouterContext3(
    "useSubmit"
    /* UseSubmit */
  );
  let { basename } = React102.useContext(NavigationContext);
  let currentRouteId = useRouteId();
  let routerFetch = router.fetch;
  let routerNavigate = router.navigate;
  return React102.useCallback(
    async (target, options = {}) => {
      let { action, method, encType, formData, body } = getFormSubmissionInfo(
        target,
        basename
      );
      if (options.navigate === false) {
        let key = options.fetcherKey || getUniqueFetcherId();
        await routerFetch(key, currentRouteId, options.action || action, {
          unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          flushSync: options.flushSync
        });
      } else {
        await routerNavigate(options.action || action, {
          unstable_defaultShouldRevalidate: options.unstable_defaultShouldRevalidate,
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          replace: options.replace,
          state: options.state,
          fromRouteId: currentRouteId,
          flushSync: options.flushSync,
          viewTransition: options.viewTransition
        });
      }
    },
    [routerFetch, routerNavigate, basename, currentRouteId]
  );
}
function useFormAction(action, { relative } = {}) {
  let { basename } = React102.useContext(NavigationContext);
  let routeContext = React102.useContext(RouteContext);
  invariant(routeContext, "useFormAction must be used inside a RouteContext");
  let [match] = routeContext.matches.slice(-1);
  let path = { ...useResolvedPath(action ? action : ".", { relative }) };
  let location = useLocation();
  if (action == null) {
    path.search = location.search;
    let params = new URLSearchParams(path.search);
    let indexValues = params.getAll("index");
    let hasNakedIndexParam = indexValues.some((v3) => v3 === "");
    if (hasNakedIndexParam) {
      params.delete("index");
      indexValues.filter((v3) => v3).forEach((v3) => params.append("index", v3));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
var SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
var savedScrollPositions = {};
function getScrollRestorationKey(location, matches, basename, getKey) {
  let key = null;
  if (getKey) {
    if (basename !== "/") {
      key = getKey(
        {
          ...location,
          pathname: stripBasename(location.pathname, basename) || location.pathname
        },
        matches
      );
    } else {
      key = getKey(location, matches);
    }
  }
  if (key == null) {
    key = location.key;
  }
  return key;
}
function useScrollRestoration({
  getKey,
  storageKey
} = {}) {
  let { router } = useDataRouterContext3(
    "useScrollRestoration"
    /* UseScrollRestoration */
  );
  let { restoreScrollPosition, preventScrollReset } = useDataRouterState2(
    "useScrollRestoration"
    /* UseScrollRestoration */
  );
  let { basename } = React102.useContext(NavigationContext);
  let location = useLocation();
  let matches = useMatches();
  let navigation = useNavigation();
  React102.useEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);
  usePageHide(
    React102.useCallback(() => {
      if (navigation.state === "idle") {
        let key = getScrollRestorationKey(location, matches, basename, getKey);
        savedScrollPositions[key] = window.scrollY;
      }
      try {
        sessionStorage.setItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY,
          JSON.stringify(savedScrollPositions)
        );
      } catch (error) {
        warning(
          false,
          `Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${error}).`
        );
      }
      window.history.scrollRestoration = "auto";
    }, [navigation.state, getKey, basename, location, matches, storageKey])
  );
  if (typeof document !== "undefined") {
    React102.useLayoutEffect(() => {
      try {
        let sessionPositions = sessionStorage.getItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY
        );
        if (sessionPositions) {
          savedScrollPositions = JSON.parse(sessionPositions);
        }
      } catch (e2) {
      }
    }, [storageKey]);
    React102.useLayoutEffect(() => {
      let disableScrollRestoration = router?.enableScrollRestoration(
        savedScrollPositions,
        () => window.scrollY,
        getKey ? (location2, matches2) => getScrollRestorationKey(location2, matches2, basename, getKey) : void 0
      );
      return () => disableScrollRestoration && disableScrollRestoration();
    }, [router, basename, getKey]);
    React102.useLayoutEffect(() => {
      if (restoreScrollPosition === false) {
        return;
      }
      if (typeof restoreScrollPosition === "number") {
        window.scrollTo(0, restoreScrollPosition);
        return;
      }
      try {
        if (location.hash) {
          let el = document.getElementById(
            decodeURIComponent(location.hash.slice(1))
          );
          if (el) {
            el.scrollIntoView();
            return;
          }
        }
      } catch {
        warning(
          false,
          `"${location.hash.slice(
            1
          )}" is not a decodable element ID. The view will not scroll to it.`
        );
      }
      if (preventScrollReset === true) {
        return;
      }
      window.scrollTo(0, 0);
    }, [location, restoreScrollPosition, preventScrollReset]);
  }
}
function usePageHide(callback, options) {
  let { capture } = options || {};
  React102.useEffect(() => {
    let opts = capture != null ? { capture } : void 0;
    window.addEventListener("pagehide", callback, opts);
    return () => {
      window.removeEventListener("pagehide", callback, opts);
    };
  }, [callback, capture]);
}
function useViewTransitionState(to, { relative } = {}) {
  let vtContext = React102.useContext(ViewTransitionContext);
  invariant(
    vtContext != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename } = useDataRouterContext3(
    "useViewTransitionState"
    /* useViewTransitionState */
  );
  let path = useResolvedPath(to, { relative });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}

// node_modules/@convex-dev/auth/dist/react/index.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var import_react30 = __toESM(require_react(), 1);

// node_modules/@convex-dev/auth/dist/react/client.js
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var import_react28 = __toESM(require_react(), 1);
var ConvexAuthActionsContext = (0, import_react28.createContext)(void 0);
var ConvexAuthInternalContext = (0, import_react28.createContext)(void 0);
var ConvexAuthTokenContext = (0, import_react28.createContext)(null);

// node_modules/@convex-dev/auth/dist/react/index.js
function useAuthActions() {
  return (0, import_react30.useContext)(ConvexAuthActionsContext);
}

// src/components/NavigationBar.tsx
var import_react33 = __toESM(require_react(), 1);

// src/contexts/AuthContextNew.tsx
var import_react31 = __toESM(require_react(), 1);
var AuthContext = (0, import_react31.createContext)(void 0);
function useAuth2() {
  const context = (0, import_react31.useContext)(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// src/components/NavigationBar.tsx
function NavigationBar() {
  const { user, role, isAuthenticated } = useAuth2();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut();
      n2.success("\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C \u0628\u0646\u062C\u0627\u062D");
      navigate("/");
    } catch (error) {
      n2.error("\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C");
    }
  };
  const getRoleIcon = (userRole) => {
    switch (userRole) {
      case "admin":
        return /* @__PURE__ */ import_react33.default.createElement(Crown, { className: "w-4 h-4" });
      case "merchant":
        return /* @__PURE__ */ import_react33.default.createElement(Store, { className: "w-4 h-4" });
      case "captain":
        return /* @__PURE__ */ import_react33.default.createElement(Truck, { className: "w-4 h-4" });
      case "customer":
        return /* @__PURE__ */ import_react33.default.createElement(ShoppingBag, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ import_react33.default.createElement(User, { className: "w-4 h-4" });
    }
  };
  const getRoleName = (userRole) => {
    switch (userRole) {
      case "admin":
        return "\u0645\u062F\u064A\u0631";
      case "merchant":
        return "\u062A\u0627\u062C\u0631";
      case "captain":
        return "\u0643\u0627\u0628\u062A\u0646";
      case "customer":
        return "\u0639\u0645\u064A\u0644";
      default:
        return "\u0645\u0633\u062A\u062E\u062F\u0645";
    }
  };
  const getRoleColor = (userRole) => {
    switch (userRole) {
      case "admin":
        return "bg-purple-500";
      case "merchant":
        return "bg-orange-500";
      case "captain":
        return "bg-blue-500";
      case "customer":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };
  if (!isAuthenticated || !user) {
    return null;
  }
  return /* @__PURE__ */ import_react33.default.createElement("nav", { className: "bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" }, /* @__PURE__ */ import_react33.default.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ import_react33.default.createElement("div", { className: "flex justify-between items-center h-16" }, /* @__PURE__ */ import_react33.default.createElement("div", { className: "flex items-center space-x-4" }, /* @__PURE__ */ import_react33.default.createElement(
    Link,
    {
      to: "/",
      className: "flex items-center space-x-2 text-gray-900 hover:text-orange-600 transition-colors"
    },
    /* @__PURE__ */ import_react33.default.createElement(House, { className: "w-6 h-6" }),
    /* @__PURE__ */ import_react33.default.createElement("span", { className: "font-bold text-lg" }, "\u0623\u0642\u0631\u0628\u0644\u064A")
  )), /* @__PURE__ */ import_react33.default.createElement("div", { className: "flex items-center space-x-4" }, /* @__PURE__ */ import_react33.default.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ import_react33.default.createElement("div", { className: `w-8 h-8 rounded-full ${getRoleColor(role || "")} flex items-center justify-center text-white` }, getRoleIcon(role || "")), /* @__PURE__ */ import_react33.default.createElement("div", { className: "hidden md:block" }, /* @__PURE__ */ import_react33.default.createElement("p", { className: "text-sm font-medium text-gray-900" }, user.profile?.fullName || "\u0645\u0633\u062A\u062E\u062F\u0645"), /* @__PURE__ */ import_react33.default.createElement("p", { className: "text-xs text-gray-500" }, getRoleName(role || "")))), /* @__PURE__ */ import_react33.default.createElement("div", { className: "flex items-center space-x-2" }, role === "customer" && /* @__PURE__ */ import_react33.default.createElement(
    Link,
    {
      to: "/customer",
      className: "px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
    },
    "\u0627\u0644\u0645\u062A\u0627\u062C\u0631"
  ), role === "merchant" && /* @__PURE__ */ import_react33.default.createElement(
    Link,
    {
      to: "/merchant",
      className: "px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
    },
    "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645"
  ), role === "captain" && /* @__PURE__ */ import_react33.default.createElement(
    Link,
    {
      to: "/captain",
      className: "px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
    },
    "\u0627\u0644\u0637\u0644\u0628\u0627\u062A"
  ), role === "admin" && /* @__PURE__ */ import_react33.default.createElement(
    Link,
    {
      to: "/admin",
      className: "px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
    },
    "\u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629"
  )), /* @__PURE__ */ import_react33.default.createElement("div", { className: "relative group" }, /* @__PURE__ */ import_react33.default.createElement("button", { className: "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ import_react33.default.createElement(Settings, { className: "w-5 h-5 text-gray-600" })), /* @__PURE__ */ import_react33.default.createElement("div", { className: "absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" }, /* @__PURE__ */ import_react33.default.createElement("div", { className: "py-2" }, /* @__PURE__ */ import_react33.default.createElement("div", { className: "px-4 py-2 border-b border-gray-100" }, /* @__PURE__ */ import_react33.default.createElement("p", { className: "text-sm font-medium text-gray-900" }, user.profile?.fullName || "\u0645\u0633\u062A\u062E\u062F\u0645"), /* @__PURE__ */ import_react33.default.createElement("p", { className: "text-xs text-gray-500" }, user.email)), /* @__PURE__ */ import_react33.default.createElement(
    "button",
    {
      onClick: handleSignOut,
      className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
    },
    /* @__PURE__ */ import_react33.default.createElement(LogOut, { className: "w-4 h-4" }),
    /* @__PURE__ */ import_react33.default.createElement("span", null, "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C")
  ))))))));
}

// src/components/AdminAuth.tsx
var import_react35 = __toESM(require_react(), 1);

// src/lib/adminAuth.ts
function normalizeAuthEmail(email) {
  return email.trim().toLowerCase();
}
function isMissingPasswordAccountError(error) {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return message.includes("InvalidAccountId") || message.includes("Invalid credentials") || message.includes("Could not find");
}
function isWrongPasswordError(error) {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return message.includes("InvalidSecret") || message.includes("Invalid credentials") && !message.includes("InvalidAccountId");
}
async function attemptPasswordSignIn(signIn, options) {
  const email = normalizeAuthEmail(options.email);
  const creds = { email, password: options.password };
  try {
    await signIn("password", { ...creds, flow: "signIn" });
    return { created: false, email };
  } catch (signInError) {
    if (options.allowSignUp && isMissingPasswordAccountError(signInError)) {
      await signIn("password", { ...creds, flow: "signUp" });
      return { created: true, email };
    }
    throw signInError;
  }
}
function waitForAuthSession(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/components/AdminAuth.tsx
function AdminAuth() {
  const { signIn } = useAuthActions();
  const ensureAdminRole = useMutation(api.profiles.ensureAdminRole);
  const resetAdminPassword = useAction(api.adminBootstrap.resetAdminPassword);
  const currentProfile = useQuery(api.profiles.getCurrentProfile);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [loading, setLoading] = (0, import_react35.useState)(false);
  const [showPassword, setShowPassword] = (0, import_react35.useState)(false);
  const [showResetForm, setShowResetForm] = (0, import_react35.useState)(false);
  const [newPassword, setNewPassword] = (0, import_react35.useState)("");
  const [confirmPassword, setConfirmPassword] = (0, import_react35.useState)("");
  const [email, setEmail] = (0, import_react35.useState)("markezzat39@gmail.com");
  const [password, setPassword] = (0, import_react35.useState)("");
  (0, import_react35.useEffect)(() => {
    if (loggedInUser && !currentProfile && !loading) {
      handleCreateAdminProfile();
    }
  }, [loggedInUser, currentProfile, loading]);
  const handleCreateAdminProfile = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await ensureAdminRole();
      if (result.ok) {
        n2.success("\u062A\u0645 \u0625\u0639\u062F\u0627\u062F \u0645\u0644\u0641 \u0627\u0644\u0645\u062F\u064A\u0631 \u0628\u0646\u062C\u0627\u062D!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating admin profile:", error);
      n2.error("\u0641\u0634\u0644 \u0625\u0639\u062F\u0627\u062F \u0645\u0644\u0641 \u0627\u0644\u0645\u062F\u064A\u0631");
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (e2) => {
    e2.preventDefault();
    if (newPassword.length < 8) {
      n2.error("\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 8 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644");
      return;
    }
    if (newPassword !== confirmPassword) {
      n2.error("\u0643\u0644\u0645\u062A\u0627 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u062A\u0637\u0627\u0628\u0642\u062A\u064A\u0646");
      return;
    }
    setLoading(true);
    try {
      await resetAdminPassword({
        email: normalizeAuthEmail(email),
        password: newPassword,
        fullName: "\u0645\u062F\u064A\u0631 \u0627\u0644\u0646\u0638\u0627\u0645"
      });
      n2.success("\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631. \u0633\u062C\u0651\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0622\u0646.");
      setPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setShowResetForm(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631";
      n2.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (e2) => {
    e2.preventDefault();
    setLoading(true);
    try {
      const { created } = await attemptPasswordSignIn(signIn, {
        email,
        password,
        allowSignUp: true
      });
      await waitForAuthSession();
      const adminResult = await ensureAdminRole();
      if (!adminResult.ok) {
        throw new Error("\u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064A\u062F \u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0644\u0647 \u0628\u062F\u062E\u0648\u0644 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u062F\u064A\u0631");
      }
      n2.success("\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0646\u062C\u0627\u062D!");
      window.location.href = "/admin";
    } catch (error) {
      if (isWrongPasswordError(error)) {
        setShowResetForm(true);
        n2.error("\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629 \u2014 \u0639\u064A\u0651\u0646 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062C\u062F\u064A\u062F\u0629 \u0645\u0646 \u0627\u0644\u0646\u0645\u0648\u0630\u062C \u0623\u062F\u0646\u0627\u0647");
      } else if (error instanceof Error && (error.message.includes("Invalid password") || error.message.includes("8"))) {
        n2.error("\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 8 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644");
      } else {
        const message = error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644";
        n2.error(message);
      }
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4", dir: "rtl" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-md w-full" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg" }, /* @__PURE__ */ React.createElement(LayoutDashboard, { className: "w-9 h-9 text-white" }))), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-gray-900 mb-2" }, "\u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644 \u0627\u0644\u0645\u062F\u064A\u0631"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "\u0623\u062F\u062E\u0644 \u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629")), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl shadow-xl p-8 border border-purple-100" }, /* @__PURE__ */ React.createElement("form", { onSubmit: handleLogin, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2 text-start" }, "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Mail, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      value: email,
      onChange: (e2) => setEmail(e2.target.value),
      className: "w-full pe-10 ps-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none",
      placeholder: "markezzat39@gmail.com",
      required: true
    }
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2 text-start" }, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Lock, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: showPassword ? "text" : "password",
      value: password,
      onChange: (e2) => setPassword(e2.target.value),
      className: "w-full pe-10 ps-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowPassword(!showPassword),
      className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    },
    showPassword ? /* @__PURE__ */ React.createElement(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ React.createElement(Eye, { className: "w-5 h-5" })
  ))), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      disabled: loading,
      className: "w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    },
    loading ? "\u062C\u0627\u0631\u064A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644..." : "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644",
    /* @__PURE__ */ React.createElement(ArrowRight, { className: "w-5 h-5 rotate-180" })
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-4 text-center" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowResetForm((v3) => !v3),
      className: "text-purple-600 hover:text-purple-700 text-sm font-medium"
    },
    showResetForm ? "\u0625\u062E\u0641\u0627\u0621 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" : "\u062A\u0639\u064A\u064A\u0646 / \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
  )), showResetForm && /* @__PURE__ */ React.createElement("form", { onSubmit: handleResetPassword, className: "mt-4 space-y-4 p-4 bg-amber-50 rounded-xl border border-amber-200" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-amber-800 text-center" }, "\u0644\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0645\u0635\u0631\u062D \u0644\u0644\u0645\u062F\u064A\u0631 \u0641\u0642\u0637 (\u0645\u062B\u0644 markezzat39@gmail.com)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      value: newPassword,
      onChange: (e2) => setNewPassword(e2.target.value),
      className: "w-full px-4 py-3 border-2 border-amber-200 rounded-xl outline-none focus:border-amber-500",
      placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 (8+ \u0623\u062D\u0631\u0641)",
      minLength: 8,
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      value: confirmPassword,
      onChange: (e2) => setConfirmPassword(e2.target.value),
      className: "w-full px-4 py-3 border-2 border-amber-200 rounded-xl outline-none focus:border-amber-500",
      placeholder: "\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
      minLength: 8,
      required: true
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      disabled: loading,
      className: "w-full py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 disabled:opacity-50"
    },
    loading ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "\u062D\u0641\u0638 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629"
  )))));
}

// src/components/AdminDashboard.tsx
function AdminDashboard() {
  const navigate = useNavigate();
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const currentProfile = useQuery(api.profiles.getCurrentProfile);
  if (!loggedInUser || !currentProfile) {
    return /* @__PURE__ */ import_react38.default.createElement(AdminAuth, null);
  }
  if (currentProfile.role !== "admin") {
    return /* @__PURE__ */ import_react38.default.createElement("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", dir: "rtl" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-center p-8 bg-white rounded-2xl shadow-sm border" }, /* @__PURE__ */ import_react38.default.createElement("h2", { className: "text-2xl font-bold text-red-600 mb-4" }, "\u062F\u062E\u0648\u0644 \u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0647"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "mb-6 text-gray-600" }, "\u0639\u0630\u0631\u0627\u064B\u060C \u0647\u0630\u0647 \u0627\u0644\u0644\u0648\u062D\u0629 \u0645\u062E\u0635\u0635\u0629 \u0644\u0644\u0645\u062F\u064A\u0631\u064A\u0646 \u0641\u0642\u0637."), /* @__PURE__ */ import_react38.default.createElement(
      "button",
      {
        onClick: () => navigate("/"),
        className: "px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      },
      "\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0631\u0626\u064A\u0633\u064A\u0629"
    )));
  }
  return /* @__PURE__ */ import_react38.default.createElement(import_react38.default.Fragment, null, /* @__PURE__ */ import_react38.default.createElement(NavigationBar, null), /* @__PURE__ */ import_react38.default.createElement("div", { className: "min-h-screen bg-gray-50", dir: "rtl" }, /* @__PURE__ */ import_react38.default.createElement(Routes, null, /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(DashboardHome, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/users", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(UsersManagement, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/orders", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(OrdersManagement, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/stores", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(StoresManagement, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/products", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(ProductsManagement, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/captains", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(CaptainsManagement, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/notifications", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(NotificationsManagement, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/activity", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(ActivityLog, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/analytics", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(AnalyticsPage, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/settings", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(SystemSettings, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/super-stores", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(AdminSuperStoreManagement, null)) }), /* @__PURE__ */ import_react38.default.createElement(Route, { path: "/admin/export", element: /* @__PURE__ */ import_react38.default.createElement(AdminLayout, null, /* @__PURE__ */ import_react38.default.createElement(AdminDataExport, null)) }))));
}
function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuthActions();
  const navItems = [
    { path: "/admin", label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: LayoutDashboard },
    { path: "/admin/users", label: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646", icon: Users },
    { path: "/admin/orders", label: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", icon: Package },
    { path: "/admin/stores", label: "\u0627\u0644\u0645\u062A\u0627\u062C\u0631", icon: Store },
    { path: "/admin/products", label: "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A", icon: ShoppingBag },
    { path: "/admin/captains", label: "\u0627\u0644\u0643\u0628\u0627\u062A\u0646", icon: Truck },
    { path: "/admin/notifications", label: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A", icon: Bell },
    { path: "/admin/activity", label: "\u0633\u062C\u0644 \u0627\u0644\u0646\u0634\u0627\u0637", icon: Activity },
    { path: "/admin/analytics", label: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631", icon: ChartColumn },
    { path: "/admin/settings", label: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A", icon: Settings },
    { path: "/admin/super-stores", label: "\u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0634\u0627\u0645\u0644\u0629", icon: Store },
    { path: "/admin/export", label: "\u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", icon: Database }
  ];
  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      n2.error("\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C");
    }
  };
  return /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex min-h-screen bg-gray-50 flex-row-reverse" }, /* @__PURE__ */ import_react38.default.createElement("aside", { className: "hidden lg:flex w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex flex-col h-full" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-4 sm:p-6 border-b border-purple-700" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2 sm:gap-3" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(LayoutDashboard, { className: "w-5 h-5 sm:w-6 sm:h-6 text-white" })), /* @__PURE__ */ import_react38.default.createElement("div", null, /* @__PURE__ */ import_react38.default.createElement("h1", { className: "text-sm sm:text-lg font-bold" }, "\u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-[10px] sm:text-xs text-purple-300" }, "Aqraply Admin")))), /* @__PURE__ */ import_react38.default.createElement("nav", { className: "flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto" }, navItems.map((item) => /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      key: item.path,
      onClick: () => navigate(item.path),
      className: `w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${isActive(item.path) ? "bg-white/20 text-white shadow-lg" : "text-purple-200 hover:bg-white/10 hover:text-white"}`
    },
    /* @__PURE__ */ import_react38.default.createElement(item.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
    item.label
  ))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-3 sm:p-4 border-t border-purple-700" }, /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      onClick: handleSignOut,
      className: "w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-purple-200 hover:bg-white/10 hover:text-white transition-all"
    },
    /* @__PURE__ */ import_react38.default.createElement(LogOut, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
    "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C"
  ))), /* @__PURE__ */ import_react38.default.createElement("main", { className: "flex-1 min-h-screen overflow-y-auto" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-3 sm:p-4 lg:p-8" }, children)));
}
function ResolvedImage({
  imageKey,
  alt,
  className
}) {
  const isHttpUrl = (value) => Boolean(value) && (value.startsWith("http://") || value.startsWith("https://"));
  const resolvedUrl = useQuery(
    api.files.getFileUrl,
    imageKey && !isHttpUrl(imageKey) ? { storageId: imageKey } : "skip"
  );
  const imageUrl = isHttpUrl(imageKey) ? imageKey : resolvedUrl || imageKey || "/placeholder-product.png";
  return /* @__PURE__ */ import_react38.default.createElement(
    "img",
    {
      src: imageUrl,
      alt,
      loading: "lazy",
      onError: (e2) => {
        e2.target.src = "/placeholder-product.png";
      },
      className
    }
  );
}
function DashboardHome() {
  const stats = useQuery(api.admin.getPlatformStats);
  const orders = useQuery(api.orders.getAllOrders);
  const recentOrders = orders?.slice(0, 8) || [];
  return /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-4 sm:p-6 lg:p-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "mb-6 sm:mb-8" }, /* @__PURE__ */ import_react38.default.createElement("h1", { className: "text-2xl sm:text-3xl font-bold text-gray-900" }, "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u{1F44B}"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-500 mt-1 text-sm sm:text-base" }, "\u0625\u0644\u064A\u0643 \u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 \u0639\u0644\u0649 \u0623\u062F\u0627\u0621 \u0627\u0644\u0645\u0646\u0635\u0629 \u0627\u0644\u064A\u0648\u0645")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8" }, /* @__PURE__ */ import_react38.default.createElement(
    StatCard,
    {
      icon: /* @__PURE__ */ import_react38.default.createElement(Package, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
      title: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A",
      value: stats?.totalOrders ?? "\u2014",
      sub: `${stats?.pendingOrders ?? 0} \u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631`,
      color: "purple",
      trend: "up"
    }
  ), /* @__PURE__ */ import_react38.default.createElement(
    StatCard,
    {
      icon: /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-xs sm:text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded" }, "EGP"),
      title: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0625\u064A\u0631\u0627\u062F\u0627\u062A",
      value: stats ? `${stats.totalRevenue.toLocaleString()} EGP` : "\u2014",
      sub: `\u0639\u0645\u0648\u0644\u0629: ${stats?.totalCommission?.toLocaleString() ?? 0} EGP`,
      color: "green",
      trend: "up"
    }
  ), /* @__PURE__ */ import_react38.default.createElement(
    StatCard,
    {
      icon: /* @__PURE__ */ import_react38.default.createElement(Store, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
      title: "\u0627\u0644\u0645\u062A\u0627\u062C\u0631",
      value: stats?.totalStores ?? "\u2014",
      sub: `${stats?.activeStores ?? 0} \u0646\u0634\u0637`,
      color: "blue",
      trend: "up"
    }
  ), /* @__PURE__ */ import_react38.default.createElement(
    StatCard,
    {
      icon: /* @__PURE__ */ import_react38.default.createElement(Truck, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
      title: "\u0627\u0644\u0643\u0628\u0627\u062A\u0646",
      value: stats?.totalCaptains ?? "\u2014",
      sub: `${stats?.onlineCaptains ?? 0} \u0645\u062A\u0635\u0644 \u0627\u0644\u0622\u0646`,
      color: "orange",
      trend: "up"
    }
  )), /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center justify-between mb-3 sm:mb-4" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-xs sm:text-sm font-medium text-gray-500" }, "\u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0645\u0633\u062C\u0644\u0648\u0646"), /* @__PURE__ */ import_react38.default.createElement(Users, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-400" })), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-2xl sm:text-3xl font-bold text-gray-900" }, stats?.totalCustomers ?? "\u2014")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center justify-between mb-3 sm:mb-4" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-xs sm:text-sm font-medium text-gray-500" }, "\u0637\u0644\u0628\u0627\u062A \u0622\u062E\u0631 7 \u0623\u064A\u0627\u0645"), /* @__PURE__ */ import_react38.default.createElement(TrendingUp, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-400" })), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-2xl sm:text-3xl font-bold text-gray-900" }, stats?.recentOrders ?? "\u2014")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center justify-between mb-3 sm:mb-4" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-xs sm:text-sm font-medium text-gray-500" }, "\u0625\u064A\u0631\u0627\u062F\u0627\u062A \u0622\u062E\u0631 7 \u0623\u064A\u0627\u0645"), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-base sm:text-lg font-bold text-gray-500" }, "EGP")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-2xl sm:text-3xl font-bold text-gray-900" }, stats ? `${stats.recentRevenue.toLocaleString()} EGP` : "\u2014"))), stats?.statusCounts && /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-6 sm:mb-8" }, /* @__PURE__ */ import_react38.default.createElement("h3", { className: "text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6" }, "\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u062D\u0633\u0628 \u0627\u0644\u062D\u0627\u0644\u0629"), /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" }, [
    { key: "pending", label: "\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631", color: "bg-yellow-100 text-yellow-700" },
    { key: "confirmed", label: "\u0645\u0624\u0643\u062F", color: "bg-blue-100 text-blue-700" },
    { key: "preparing", label: "\u0642\u064A\u062F \u0627\u0644\u062A\u062D\u0636\u064A\u0631", color: "bg-purple-100 text-purple-700" },
    { key: "delivering", label: "\u0642\u064A\u062F \u0627\u0644\u062A\u0648\u0635\u064A\u0644", color: "bg-orange-100 text-orange-700" },
    { key: "delivered", label: "\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644", color: "bg-green-100 text-green-700" },
    { key: "cancelled", label: "\u0645\u0644\u063A\u064A", color: "bg-red-100 text-red-700" },
    { key: "assigned", label: "\u062A\u0645 \u0627\u0644\u062A\u0639\u064A\u064A\u0646", color: "bg-indigo-100 text-indigo-700" },
    { key: "ready", label: "\u062C\u0627\u0647\u0632", color: "bg-teal-100 text-teal-700" }
  ].map(({ key, label, color }) => /* @__PURE__ */ import_react38.default.createElement("div", { key, className: `rounded-xl p-3 sm:p-4 ${color}` }, /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-xl sm:text-2xl font-bold" }, stats.statusCounts[key] || 0), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-xs sm:text-sm font-medium mt-1" }, label))))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between" }, /* @__PURE__ */ import_react38.default.createElement("h3", { className: "text-base sm:text-lg font-bold text-gray-900" }, "\u0622\u062E\u0631 \u0627\u0644\u0637\u0644\u0628\u0627\u062A"), /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      onClick: () => window.location.href = "/admin/orders",
      className: "text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium"
    },
    "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644"
  )), /* @__PURE__ */ import_react38.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react38.default.createElement("table", { className: "w-full min-w-[600px]" }, /* @__PURE__ */ import_react38.default.createElement("thead", { className: "bg-gray-50" }, /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0627\u0644\u0639\u0645\u064A\u0644"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0627\u0644\u0645\u0628\u0644\u063A"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0627\u0644\u062D\u0627\u0644\u0629"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-6 py-2 sm:py-3 text-start text-[10px] sm:text-xs font-semibold text-gray-600" }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"))), /* @__PURE__ */ import_react38.default.createElement("tbody", { className: "divide-y divide-gray-100" }, recentOrders.length === 0 ? /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("td", { colSpan: 6, className: "px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-400 text-xs sm:text-sm" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0628\u0639\u062F")) : recentOrders.map((order) => /* @__PURE__ */ import_react38.default.createElement("tr", { key: order._id, className: "hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-mono font-medium text-gray-900" }, order.orderNumber), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-700" }, order.customerInfo?.fullName || "\u2014"), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-6 py-2 sm:py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "space-y-1 sm:space-y-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-xs sm:text-sm font-medium text-gray-900" }, order.storeInfo?.name || "\u2014"), order.storeInfo?.address && /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-[10px] sm:text-xs text-gray-500 flex items-center gap-1" }, /* @__PURE__ */ import_react38.default.createElement(MapPin, { className: "w-3 h-3" }), order.storeInfo?.address), order.storeInfo?.phone && /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-[10px] sm:text-xs text-gray-500 flex items-center gap-1" }, /* @__PURE__ */ import_react38.default.createElement(Phone, { className: "w-3 h-3" }), order.storeInfo?.phone), /* @__PURE__ */ import_react38.default.createElement("div", { className: "mt-1 sm:mt-2 space-y-1" }, order.items.slice(0, 2).map((item, idx) => /* @__PURE__ */ import_react38.default.createElement("div", { key: idx, className: "flex items-center gap-2 text-[10px] sm:text-xs" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-4 h-4 bg-gray-200 rounded overflow-hidden flex-shrink-0" }, /* @__PURE__ */ import_react38.default.createElement(
    ResolvedImage,
    {
      imageKey: item.imageUrl || item.image || item.productImage || item.product?.imageUrl,
      alt: item.nameAr || item.name || "\u0645\u0646\u062A\u062C",
      className: "w-8 h-8 sm:w-12 sm:h-12 rounded-lg object-cover"
    }
  )), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex-1" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: "font-medium" }, item.nameAr), (item.productCode || item.code || item.sku) && /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-blue-600" }, "(", item.productCode || item.code || item.sku, ")")), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-gray-500" }, "\xD7", item.quantity))), order.items.length > 2 && /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-[10px] sm:text-xs text-gray-500" }, "+", order.items.length - 2, " \u0623\u062E\u0631\u0649")))), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-bold text-gray-900" }, order.total, " EGP"), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-6 py-2 sm:py-4" }, /* @__PURE__ */ import_react38.default.createElement(StatusBadge, { status: order.status })), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-6 py-2 sm:py-4 text-[10px] sm:text-sm text-gray-500" }, new Date(order._creationTime).toLocaleDateString("ar-EG")))))))));
}
function OrderRow({
  order,
  captains,
  assigningCaptain,
  onStartAssign,
  onAssignCaptain,
  onCancelOrder,
  onSelectInvoice,
  resolveImageSrc
}) {
  const captainOptions = (0, import_react38.useMemo)(
    () => captains?.filter((c2) => c2.isActive && c2.isOnline) ?? [],
    [captains]
  );
  return /* @__PURE__ */ import_react38.default.createElement("tr", { className: "hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-mono font-bold text-purple-700" }, order.orderNumber), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", null, /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-xs sm:text-sm font-semibold text-gray-900" }, order.customerInfo?.fullName || "\u2014"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-[10px] sm:text-xs text-gray-500" }, order.customerInfo?.phone || ""), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-[10px] sm:text-xs text-gray-600 mt-1 flex items-center gap-1" }, /* @__PURE__ */ import_react38.default.createElement(MapPin, { className: "w-3 h-3" }), order.customerLocation?.addressAr ?? order.deliveryLocation?.addressAr ?? "\u2014"))), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-xs sm:text-sm font-medium text-gray-900" }, order.storeInfo?.name || "\u2014"), order.storeInfo?.address && /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-[10px] sm:text-xs text-gray-500 flex items-center gap-1" }, /* @__PURE__ */ import_react38.default.createElement(MapPin, { className: "w-3 h-3" }), order.storeInfo?.address), order.storeInfo?.phone && /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-[10px] sm:text-xs text-gray-500 flex items-center gap-1" }, /* @__PURE__ */ import_react38.default.createElement(Phone, { className: "w-3 h-3" }), order.storeInfo?.phone))), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react38.default.createElement("p", { className: "font-semibold text-gray-900" }, order.items.length, " \u0645\u0646\u062A\u062C"), order.items.slice(0, 2).map((item, idx) => {
    const imageSource = resolveImageSrc(
      item.imageUrl || item.image || item.productImage || item.product?.imageUrl || item.images?.[0]
    );
    return /* @__PURE__ */ import_react38.default.createElement(
      "div",
      {
        key: `${item.productId ?? item.productCode ?? item.sku ?? item._id ?? item.nameAr}-${idx}`,
        className: "flex items-start gap-2 pb-2 border-b border-gray-100 last:border-0"
      },
      /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0" }, /* @__PURE__ */ import_react38.default.createElement(
        "img",
        {
          src: imageSource,
          alt: item.nameAr || item.name || "\u0645\u0646\u062A\u062C",
          loading: "lazy",
          className: "w-full h-full object-cover",
          onError: (e2) => {
            e2.target.src = "/placeholder-product.png";
          }
        }
      )),
      /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-start justify-between gap-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-[10px] sm:text-xs text-gray-900 font-medium truncate" }, item.nameAr || item.name || "\u0645\u0646\u062A\u062C"), (item.productCode || item.code || item.sku) && /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-[10px] sm:text-xs text-blue-600 font-mono truncate" }, item.productCode || item.code || item.sku)), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-[10px] sm:text-xs text-gray-500 font-medium" }, "\xD7", item.quantity)), (item.color || item.selectedSize) && /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex gap-1 mt-1" }, item.color && /* @__PURE__ */ import_react38.default.createElement("span", { className: "inline-block bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-2xs" }, item.color), item.selectedSize && /* @__PURE__ */ import_react38.default.createElement("span", { className: "inline-block bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-2xs" }, item.selectedSize)))
    );
  }), order.items.length > 2 && /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-[10px] sm:text-xs text-gray-400" }, "+", order.items.length - 2, " \u0623\u062E\u0631\u0649"))), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-[10px] sm:text-xs text-gray-600 space-y-1" }, order.items.slice(0, 2).map((item) => /* @__PURE__ */ import_react38.default.createElement("div", { key: item.productId ?? item.productCode ?? item.sku ?? item._id ?? item.nameAr, className: "font-mono text-[10px] sm:text-xs" }, item.productCode || item.code || item.sku || "\u2014")), order.items.length > 2 && /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-[10px] sm:text-xs text-gray-400" }, "..."))), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-900" }, order.total, " EGP"), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4" }, /* @__PURE__ */ import_react38.default.createElement(StatusBadge, { status: order.status })), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4" }, order.captainId ? /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-[10px] sm:text-xs text-green-600 font-medium flex items-center gap-1" }, /* @__PURE__ */ import_react38.default.createElement(UserCheck, { className: "w-3 h-3" }), " \u0645\u0639\u064A\u0646") : order.status === "pending" || order.status === "confirmed" ? /* @__PURE__ */ import_react38.default.createElement("div", { className: "relative" }, assigningCaptain === order._id ? /* @__PURE__ */ import_react38.default.createElement(
    "select",
    {
      className: "text-[10px] sm:text-xs border border-purple-300 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500",
      onChange: (e2) => {
        if (e2.target.value) onAssignCaptain(order._id, e2.target.value);
      },
      defaultValue: ""
    },
    /* @__PURE__ */ import_react38.default.createElement("option", { value: "" }, "\u0627\u062E\u062A\u0631 \u0643\u0627\u0628\u062A\u0646"),
    captainOptions.map((c2) => /* @__PURE__ */ import_react38.default.createElement("option", { key: c2._id, value: c2.userId }, c2.fullName))
  ) : /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      onClick: () => onStartAssign(order._id),
      className: "text-[10px] sm:text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-200 transition-colors"
    },
    "\u062A\u0639\u064A\u064A\u0646 \u0643\u0627\u0628\u062A\u0646"
  )) : /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-[10px] sm:text-xs text-gray-400" }, "\u2014")), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4 text-[10px] sm:text-xs text-gray-500" }, new Date(order._creationTime).toLocaleDateString("ar-EG")), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-3 sm:px-4 py-3 sm:py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex gap-1 sm:gap-2 flex-wrap" }, order.paymentMethod === "wallet" && order.paymentReceiptImage && /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      onClick: () => window.open(order.paymentReceiptImage, "_blank"),
      className: "text-[10px] sm:text-xs bg-green-100 text-green-700 hover:bg-green-200 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1",
      title: "\u0639\u0631\u0636 \u0625\u064A\u0635\u0627\u0644 \u0627\u0644\u062F\u0641\u0639"
    },
    /* @__PURE__ */ import_react38.default.createElement(Eye, { className: "w-3 h-3" })
  ), /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      onClick: () => onSelectInvoice(order),
      className: "text-[10px] sm:text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1",
      title: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629"
    },
    /* @__PURE__ */ import_react38.default.createElement(Printer, { className: "w-3 h-3" })
  ), order.status !== "cancelled" && order.status !== "delivered" && /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      onClick: () => onCancelOrder(order._id),
      className: "text-[10px] sm:text-xs bg-red-100 text-red-700 hover:bg-red-200 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg font-semibold transition-colors"
    },
    "\u0625\u0644\u063A\u0627\u0621"
  ))));
}
function areOrderRowPropsEqual(prevProps, nextProps) {
  if (prevProps.assigningCaptain !== nextProps.assigningCaptain) return false;
  if (prevProps.onStartAssign !== nextProps.onStartAssign || prevProps.onAssignCaptain !== nextProps.onAssignCaptain || prevProps.onCancelOrder !== nextProps.onCancelOrder || prevProps.onSelectInvoice !== nextProps.onSelectInvoice || prevProps.resolveImageSrc !== nextProps.resolveImageSrc) {
    return false;
  }
  const prevOrder = prevProps.order;
  const nextOrder = nextProps.order;
  if (!prevOrder || !nextOrder || prevOrder._id !== nextOrder._id) return false;
  if (prevOrder.orderNumber !== nextOrder.orderNumber || prevOrder.total !== nextOrder.total || prevOrder.status !== nextOrder.status || prevOrder.captainId !== nextOrder.captainId || prevOrder.paymentMethod !== nextOrder.paymentMethod || prevOrder.paymentReceiptImage !== nextOrder.paymentReceiptImage) {
    return false;
  }
  const prevCust = prevOrder.customerInfo ?? {};
  const nextCust = nextOrder.customerInfo ?? {};
  if (prevCust.fullName !== nextCust.fullName || prevCust.phone !== nextCust.phone) return false;
  if ((prevOrder.customerLocation?.addressAr ?? "") !== (nextOrder.customerLocation?.addressAr ?? "") || (prevOrder.deliveryLocation?.addressAr ?? "") !== (nextOrder.deliveryLocation?.addressAr ?? "")) {
    return false;
  }
  const prevStore = prevOrder.storeInfo ?? {};
  const nextStore = nextOrder.storeInfo ?? {};
  if (prevStore.name !== nextStore.name || prevStore.address !== nextStore.address || prevStore.phone !== nextStore.phone) {
    return false;
  }
  if (prevOrder.items.length !== nextOrder.items.length) return false;
  for (let i2 = 0; i2 < prevOrder.items.length; i2++) {
    const prevItem = prevOrder.items[i2];
    const nextItem = nextOrder.items[i2];
    if (prevItem.productId !== nextItem.productId || prevItem.productCode !== nextItem.productCode || prevItem.sku !== nextItem.sku || prevItem.quantity !== nextItem.quantity || prevItem.nameAr !== nextItem.nameAr || prevItem.name !== nextItem.name || prevItem.imageUrl !== nextItem.imageUrl || prevItem.image !== nextItem.image || prevItem.productImage !== nextItem.productImage || (prevItem.product?.imageUrl ?? "") !== (nextItem.product?.imageUrl ?? "") || (prevItem.images?.[0] ?? "") !== (nextItem.images?.[0] ?? "") || prevItem.color !== nextItem.color || prevItem.selectedSize !== nextItem.selectedSize || prevItem.price !== nextItem.price) {
      return false;
    }
  }
  const prevCaptains = prevProps.captains ?? [];
  const nextCaptains = nextProps.captains ?? [];
  if (prevCaptains.length !== nextCaptains.length) return false;
  for (let i2 = 0; i2 < prevCaptains.length; i2++) {
    const prevCaptain = prevCaptains[i2];
    const nextCaptain = nextCaptains[i2];
    if (prevCaptain._id !== nextCaptain._id || prevCaptain.userId !== nextCaptain.userId || prevCaptain.fullName !== nextCaptain.fullName || prevCaptain.isActive !== nextCaptain.isActive || prevCaptain.isOnline !== nextCaptain.isOnline) {
      return false;
    }
  }
  return true;
}
var MemoizedOrderRow = import_react38.default.memo(OrderRow, areOrderRowPropsEqual);
function OrdersManagement() {
  const orders = useQuery(api.orders.getAllOrders);
  const captains = useQuery(api.captains.getAllCaptains);
  const assignCaptain = useMutation(api.admin.assignCaptainToOrder);
  const cancelOrder = useMutation(api.admin.cancelOrder);
  const [selectedStatus, setSelectedStatus] = (0, import_react38.useState)(null);
  const [searchTerm, setSearchTerm] = (0, import_react38.useState)("");
  const [assigningCaptain, setAssigningCaptain] = (0, import_react38.useState)(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = (0, import_react38.useState)(null);
  const filteredOrders = (0, import_react38.useMemo)(
    () => (orders || []).filter((o2) => !selectedStatus || o2.status === selectedStatus).filter(
      (o2) => !searchTerm || o2.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || o2.customerInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [orders, selectedStatus, searchTerm]
  );
  const storageIdsToResolve = (0, import_react38.useMemo)(() => {
    const ids = /* @__PURE__ */ new Set();
    const isHttpUrl = (value) => typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"));
    for (const order of orders || []) {
      for (const item of order.items || []) {
        const imageValue = item.imageUrl ?? item.image ?? item.productImage ?? item.product?.imageUrl ?? item.images?.[0];
        if (typeof imageValue === "string" && imageValue && !isHttpUrl(imageValue)) {
          ids.add(imageValue);
        }
      }
    }
    return Array.from(ids);
  }, [orders]);
  const resolvedStorageUrls = useQuery(
    api.files.getFileUrls,
    storageIdsToResolve.length ? { storageIds: storageIdsToResolve } : "skip"
  );
  const imageIdToUrl = (0, import_react38.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    if (!resolvedStorageUrls) return map;
    storageIdsToResolve.forEach((id, idx) => {
      map.set(id, resolvedStorageUrls[idx]);
    });
    return map;
  }, [resolvedStorageUrls, storageIdsToResolve]);
  const resolveImageSrc = (0, import_react38.useCallback)(
    (value) => {
      if (!value || typeof value !== "string") return "/placeholder-product.png";
      if (value.startsWith("http://") || value.startsWith("https://")) return value;
      return imageIdToUrl.get(value) || "/placeholder-product.png";
    },
    [imageIdToUrl]
  );
  const captainOptions = (0, import_react38.useMemo)(
    () => captains?.filter((c2) => c2.isActive && c2.isOnline) ?? [],
    [captains]
  );
  const handleSearchTermChange = (0, import_react38.useCallback)((event) => {
    setSearchTerm(event.target.value);
  }, []);
  const handleSelectStatus = (0, import_react38.useCallback)((key) => {
    setSelectedStatus(key);
  }, []);
  const handleStartAssign = (0, import_react38.useCallback)((orderId) => {
    setAssigningCaptain(orderId);
  }, []);
  const handleSelectInvoice = (0, import_react38.useCallback)((order) => {
    setSelectedOrderForInvoice(order);
  }, []);
  const handleAssignCaptain = (0, import_react38.useCallback)(async (orderId, captainId) => {
    try {
      await assignCaptain({
        orderId,
        captainId
      });
      n2.success("\u062A\u0645 \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0643\u0627\u0628\u062A\u0646 \u0628\u0646\u062C\u0627\u062D");
      setAssigningCaptain(null);
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0643\u0627\u0628\u062A\u0646");
    }
  }, [assignCaptain]);
  const handleCancelOrder = (0, import_react38.useCallback)(async (orderId) => {
    try {
      await cancelOrder({ orderId });
      n2.success("\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628");
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628");
    }
  }, [cancelOrder]);
  const orderRows = (0, import_react38.useMemo)(
    () => filteredOrders.map((order) => /* @__PURE__ */ import_react38.default.createElement(
      MemoizedOrderRow,
      {
        key: order._id,
        order,
        captains: captainOptions,
        assigningCaptain,
        onStartAssign: handleStartAssign,
        onAssignCaptain: handleAssignCaptain,
        onCancelOrder: handleCancelOrder,
        onSelectInvoice: handleSelectInvoice,
        resolveImageSrc
      }
    )),
    [filteredOrders, captainOptions, assigningCaptain, handleStartAssign, handleAssignCaptain, handleCancelOrder, handleSelectInvoice, resolveImageSrc]
  );
  const statuses = [
    { key: null, label: "\u0627\u0644\u0643\u0644" },
    { key: "pending", label: "\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631" },
    { key: "confirmed", label: "\u0645\u0624\u0643\u062F" },
    { key: "assigned", label: "\u062A\u0645 \u0627\u0644\u062A\u0639\u064A\u064A\u0646" },
    { key: "preparing", label: "\u0642\u064A\u062F \u0627\u0644\u062A\u062D\u0636\u064A\u0631" },
    { key: "ready", label: "\u062C\u0627\u0647\u0632" },
    { key: "delivering", label: "\u0642\u064A\u062F \u0627\u0644\u062A\u0648\u0635\u064A\u0644" },
    { key: "delivered", label: "\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644" },
    { key: "cancelled", label: "\u0645\u0644\u063A\u064A" }
  ];
  return /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-4 sm:p-6 lg:p-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "mb-6 sm:mb-8" }, /* @__PURE__ */ import_react38.default.createElement("h1", { className: "text-2xl sm:text-3xl font-bold text-gray-900" }, "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-500 mt-1 text-sm sm:text-base" }, orders ? `${orders.length} \u0637\u0644\u0628 \u0625\u062C\u0645\u0627\u0644\u0627\u064B` : "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm mb-4 sm:mb-6" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex flex-col sm:flex-row gap-3 sm:gap-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ import_react38.default.createElement(Search, { className: "absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react38.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0628\u062D\u062B \u0628\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628 \u0623\u0648 \u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644...",
      value: searchTerm,
      onChange: handleSearchTermChange,
      className: "w-full pr-10 pl-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex gap-1 sm:gap-2 overflow-x-auto" }, statuses.map(({ key, label }) => /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      key: String(key),
      onClick: () => handleSelectStatus(key),
      className: `px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all ${selectedStatus === key ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`
    },
    label
  ))))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react38.default.createElement("table", { className: "w-full min-w-[800px]" }, /* @__PURE__ */ import_react38.default.createElement("thead", { className: "bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200" }, /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0639\u0645\u064A\u0644"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0643\u0648\u062F \u0627\u0644\u0645\u0646\u062A\u062C"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0645\u0628\u0644\u063A"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u062D\u0627\u0644\u0629"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0643\u0627\u0628\u062A\u0646"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-3 sm:px-4 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-semibold text-gray-600 uppercase" }, "\u0625\u062C\u0631\u0627\u0621\u0627\u062A"))), /* @__PURE__ */ import_react38.default.createElement("tbody", { className: "divide-y divide-gray-100" }, !orders ? /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("td", { colSpan: 10, className: "px-4 sm:px-6 py-8 sm:py-12 text-center" }, /* @__PURE__ */ import_react38.default.createElement(RefreshCw, { className: "w-5 h-5 sm:w-6 sm:h-6 text-gray-400 animate-spin mx-auto mb-2" }), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-400 text-xs sm:text-sm" }, "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644..."))) : filteredOrders.length === 0 ? /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("td", { colSpan: 10, className: "px-4 sm:px-6 py-8 sm:py-12 text-center" }, /* @__PURE__ */ import_react38.default.createElement(Package, { className: "w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" }), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-400 font-medium text-xs sm:text-sm" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A"))) : orderRows)))), selectedOrderForInvoice && /* @__PURE__ */ import_react38.default.createElement(
    InvoicePrint,
    {
      order: selectedOrderForInvoice,
      onClose: () => setSelectedOrderForInvoice(null)
    }
  ));
}
function StoresManagement() {
  const stores = useQuery(api.admin.getAllStores);
  const toggleStore = useMutation(api.admin.toggleStoreActive);
  const [searchTerm, setSearchTerm] = (0, import_react38.useState)("");
  const [filterActive, setFilterActive] = (0, import_react38.useState)(null);
  const filteredStores = (stores || []).filter((s2) => filterActive === null || s2.isActive === filterActive).filter(
    (s2) => !searchTerm || s2.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) || s2.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleToggle = async (storeId, currentActive) => {
    try {
      await toggleStore({
        storeId,
        isActive: !currentActive
      });
      n2.success(!currentActive ? "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0645\u062A\u062C\u0631" : "\u062A\u0645 \u062A\u0639\u0637\u064A\u0644 \u0627\u0644\u0645\u062A\u062C\u0631");
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u062A\u062C\u0631");
    }
  };
  const categoryLabels = {
    restaurant: "\u0645\u0637\u0639\u0645",
    grocery: "\u0628\u0642\u0627\u0644\u0629",
    pharmacy: "\u0635\u064A\u062F\u0644\u064A\u0629",
    electronics: "\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A",
    clothing: "\u0645\u0644\u0627\u0628\u0633",
    other: "\u0623\u062E\u0631\u0649"
  };
  return /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react38.default.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062A\u0627\u062C\u0631"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-500 mt-1" }, stores ? `${stores.length} \u0645\u062A\u062C\u0631 \u0625\u062C\u0645\u0627\u0644\u0627\u064B` : "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(Store, { className: "w-5 h-5 text-blue-600" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u062A\u0627\u062C\u0631")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, stores?.length ?? "\u2014")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(CircleCheckBig, { className: "w-5 h-5 text-green-600" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0645\u062A\u0627\u062C\u0631 \u0646\u0634\u0637\u0629")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, stores?.filter((s2) => s2.isActive).length ?? "\u2014")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(CircleX, { className: "w-5 h-5 text-red-600" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0645\u062A\u0627\u062C\u0631 \u0645\u0639\u0637\u0644\u0629")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, stores?.filter((s2) => !s2.isActive).length ?? "\u2014"))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ import_react38.default.createElement(Search, { className: "absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react38.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0628\u062D\u062B \u0628\u0627\u0633\u0645 \u0627\u0644\u0645\u062A\u062C\u0631...",
      value: searchTerm,
      onChange: (e2) => setSearchTerm(e2.target.value),
      className: "w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex gap-2" }, [
    { val: null, label: "\u0627\u0644\u0643\u0644" },
    { val: true, label: "\u0646\u0634\u0637" },
    { val: false, label: "\u0645\u0639\u0637\u0644" }
  ].map(({ val, label }) => /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      key: String(val),
      onClick: () => setFilterActive(val),
      className: `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterActive === val ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`
    },
    label
  )))), !stores ? /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, [1, 2, 3, 4, 5, 6].map((i2) => /* @__PURE__ */ import_react38.default.createElement("div", { key: i2, className: "bg-white rounded-2xl p-6 border border-gray-100 animate-pulse" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "h-4 bg-gray-200 rounded w-3/4 mb-3" }), /* @__PURE__ */ import_react38.default.createElement("div", { className: "h-3 bg-gray-200 rounded w-1/2 mb-6" }), /* @__PURE__ */ import_react38.default.createElement("div", { className: "h-8 bg-gray-200 rounded" })))) : filteredStores.length === 0 ? /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-16 text-center border border-gray-100" }, /* @__PURE__ */ import_react38.default.createElement(Store, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-400 font-medium text-lg" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062A\u0627\u062C\u0631")) : /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, filteredStores.map((store) => /* @__PURE__ */ import_react38.default.createElement(
    "div",
    {
      key: store._id,
      className: "bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
    },
    /* @__PURE__ */ import_react38.default.createElement("div", { className: "h-32 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative" }, store.imageUrl ? /* @__PURE__ */ import_react38.default.createElement(
      "img",
      {
        src: store.imageUrl,
        alt: store.nameAr,
        className: "w-full h-full object-cover"
      }
    ) : /* @__PURE__ */ import_react38.default.createElement(Store, { className: "w-12 h-12 text-purple-300" }), /* @__PURE__ */ import_react38.default.createElement("div", { className: "absolute top-3 left-3" }, /* @__PURE__ */ import_react38.default.createElement(
      "span",
      {
        className: `px-2 py-1 rounded-full text-xs font-bold ${store.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`
      },
      store.isActive ? "\u0646\u0634\u0637" : "\u0645\u0639\u0637\u0644"
    ))),
    /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-5" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-start justify-between mb-3" }, /* @__PURE__ */ import_react38.default.createElement("div", null, /* @__PURE__ */ import_react38.default.createElement("h3", { className: "font-bold text-gray-900 text-lg" }, store.nameAr), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-sm text-gray-500" }, store.name)), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-medium" }, categoryLabels[store.category] || store.category)), /* @__PURE__ */ import_react38.default.createElement("div", { className: "space-y-2 mb-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-600" }, /* @__PURE__ */ import_react38.default.createElement(MapPin, { className: "w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react38.default.createElement("span", { className: "truncate" }, store.location.addressAr)), store.phone && /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-600" }, /* @__PURE__ */ import_react38.default.createElement(Phone, { className: "w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react38.default.createElement("span", { dir: "ltr" }, store.phone)), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-600" }, /* @__PURE__ */ import_react38.default.createElement(Star, { className: "w-4 h-4 text-yellow-400" }), /* @__PURE__ */ import_react38.default.createElement("span", null, store.rating.toFixed(1), " \u2022 ", store.totalOrders, " \u0637\u0644\u0628")), store.ownerProfile && /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-600" }, /* @__PURE__ */ import_react38.default.createElement(Users, { className: "w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react38.default.createElement("span", null, store.ownerProfile.fullName))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center justify-between pt-3 border-t border-gray-100" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-sm" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-gray-500" }, "\u0627\u0644\u0639\u0645\u0648\u0644\u0629: "), /* @__PURE__ */ import_react38.default.createElement("span", { className: "font-bold text-gray-900" }, store.commissionRate, "%")), /* @__PURE__ */ import_react38.default.createElement(
      "button",
      {
        onClick: () => handleToggle(store._id, store.isActive),
        className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${store.isActive ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`
      },
      /* @__PURE__ */ import_react38.default.createElement(Power, { className: "w-4 h-4" }),
      store.isActive ? "\u062A\u0639\u0637\u064A\u0644" : "\u062A\u0641\u0639\u064A\u0644"
    )))
  ))));
}
function CaptainsManagement() {
  const captains = useQuery(api.captains.getAllCaptains);
  const [searchTerm, setSearchTerm] = (0, import_react38.useState)("");
  const [filterOnline, setFilterOnline] = (0, import_react38.useState)(null);
  const filteredCaptains = (captains || []).filter((c2) => filterOnline === null || c2.isOnline === filterOnline).filter(
    (c2) => !searchTerm || c2.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || c2.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react38.default.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0643\u0628\u0627\u062A\u0646"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-500 mt-1" }, captains ? `${captains.length} \u0643\u0627\u0628\u062A\u0646 \u0645\u0633\u062C\u0644` : "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(Truck, { className: "w-5 h-5 text-purple-600" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0643\u0628\u0627\u062A\u0646")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, captains?.length ?? "\u2014")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-3 h-3 bg-green-500 rounded-full" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0645\u062A\u0635\u0644\u0648\u0646 \u0627\u0644\u0622\u0646")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, captains?.filter((c2) => c2.isOnline).length ?? "\u2014")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(UserCheck, { className: "w-5 h-5 text-blue-600" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0643\u0628\u0627\u062A\u0646 \u0646\u0634\u0637\u0648\u0646")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, captains?.filter((c2) => c2.isActive).length ?? "\u2014"))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ import_react38.default.createElement(Search, { className: "absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react38.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0628\u062D\u062B \u0628\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0628\u062A\u0646 \u0623\u0648 \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641...",
      value: searchTerm,
      onChange: (e2) => setSearchTerm(e2.target.value),
      className: "w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex gap-2" }, [
    { val: null, label: "\u0627\u0644\u0643\u0644" },
    { val: true, label: "\u0645\u062A\u0635\u0644" },
    { val: false, label: "\u063A\u064A\u0631 \u0645\u062A\u0635\u0644" }
  ].map(({ val, label }) => /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      key: String(val),
      onClick: () => setFilterOnline(val),
      className: `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterOnline === val ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`
    },
    label
  )))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react38.default.createElement("table", { className: "w-full" }, /* @__PURE__ */ import_react38.default.createElement("thead", { className: "bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200" }, /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0643\u0627\u0628\u062A\u0646"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u062D\u0627\u0644\u0629"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0622\u062E\u0631 \u0638\u0647\u0648\u0631"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u0633\u062C\u064A\u0644"))), /* @__PURE__ */ import_react38.default.createElement("tbody", { className: "divide-y divide-gray-100" }, !captains ? /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("td", { colSpan: 6, className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react38.default.createElement(RefreshCw, { className: "w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" }), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-400" }, "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644..."))) : filteredCaptains.length === 0 ? /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("td", { colSpan: 6, className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react38.default.createElement(Truck, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-400 font-medium" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0643\u0628\u0627\u062A\u0646"))) : filteredCaptains.map((captain) => /* @__PURE__ */ import_react38.default.createElement("tr", { key: captain._id, className: "hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm" }, captain.fullName?.charAt(0) || "K"), /* @__PURE__ */ import_react38.default.createElement("div", null, /* @__PURE__ */ import_react38.default.createElement("p", { className: "font-semibold text-gray-900" }, captain.fullName), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-xs text-gray-500" }, "\u0643\u0627\u0628\u062A\u0646 \u062A\u0648\u0635\u064A\u0644")))), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-700" }, /* @__PURE__ */ import_react38.default.createElement(Phone, { className: "w-4 h-4 text-gray-400" }), captain.phone || "\u2014")), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react38.default.createElement(
    "span",
    {
      className: `flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${captain.isOnline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`
    },
    /* @__PURE__ */ import_react38.default.createElement(
      "span",
      {
        className: `w-2 h-2 rounded-full ${captain.isOnline ? "bg-green-500" : "bg-gray-400"}`
      }
    ),
    captain.isOnline ? "\u0645\u062A\u0635\u0644" : "\u063A\u064A\u0631 \u0645\u062A\u0635\u0644"
  ), !captain.isActive && /* @__PURE__ */ import_react38.default.createElement("span", { className: "px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700" }, "\u0645\u0639\u0637\u0644"))), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4 text-sm text-gray-500" }, captain.lastSeen ? new Date(captain.lastSeen).toLocaleString("ar-EG") : "\u2014"), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4 text-sm text-gray-500" }, new Date(captain._creationTime).toLocaleDateString("ar-EG")))))))));
}
function AnalyticsPage() {
  const stats = useQuery(api.admin.getPlatformStats);
  const orders = useQuery(api.orders.getAllOrders);
  const stores = useQuery(api.admin.getAllStores);
  const dailyRevenue = (() => {
    if (!orders) return [];
    const days = [];
    for (let i2 = 6; i2 >= 0; i2--) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - i2);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1e3;
      const dayOrders = orders.filter(
        (o2) => o2._creationTime >= dayStart && o2._creationTime < dayEnd
      );
      days.push({
        label: date.toLocaleDateString("ar-EG", { weekday: "short" }),
        revenue: dayOrders.reduce((sum, o2) => sum + o2.total, 0),
        count: dayOrders.length
      });
    }
    return days;
  })();
  const maxRevenue = Math.max(...dailyRevenue.map((d2) => d2.revenue), 1);
  const topStores = stores ? [...stores].sort((a2, b3) => b3.totalOrders - a2.totalOrders).slice(0, 5) : [];
  return /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react38.default.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0644\u0627\u062A"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-500 mt-1" }, "\u0646\u0638\u0631\u0629 \u0634\u0627\u0645\u0644\u0629 \u0639\u0644\u0649 \u0623\u062F\u0627\u0621 \u0627\u0644\u0645\u0646\u0635\u0629")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" }, /* @__PURE__ */ import_react38.default.createElement(
    KpiCard,
    {
      title: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0625\u064A\u0631\u0627\u062F\u0627\u062A",
      value: stats ? `${stats.totalRevenue.toLocaleString()} EGP` : "\u2014",
      icon: /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded" }, "EGP"),
      color: "green"
    }
  ), /* @__PURE__ */ import_react38.default.createElement(
    KpiCard,
    {
      title: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0639\u0645\u0648\u0644\u0627\u062A",
      value: stats ? `${stats.totalCommission.toLocaleString()} EGP` : "\u2014",
      icon: /* @__PURE__ */ import_react38.default.createElement(TrendingUp, { className: "w-5 h-5" }),
      color: "purple"
    }
  ), /* @__PURE__ */ import_react38.default.createElement(
    KpiCard,
    {
      title: "\u0645\u0639\u062F\u0644 \u0627\u0644\u0625\u062A\u0645\u0627\u0645",
      value: stats && stats.totalOrders > 0 ? `${Math.round((stats.statusCounts?.delivered || 0) / stats.totalOrders * 100)}%` : "\u2014",
      icon: /* @__PURE__ */ import_react38.default.createElement(CircleCheckBig, { className: "w-5 h-5" }),
      color: "blue"
    }
  ), /* @__PURE__ */ import_react38.default.createElement(
    KpiCard,
    {
      title: "\u0645\u0639\u062F\u0644 \u0627\u0644\u0625\u0644\u063A\u0627\u0621",
      value: stats && stats.totalOrders > 0 ? `${Math.round((stats.statusCounts?.cancelled || 0) / stats.totalOrders * 100)}%` : "\u2014",
      icon: /* @__PURE__ */ import_react38.default.createElement(CircleX, { className: "w-5 h-5" }),
      color: "red"
    }
  )), /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("h3", { className: "text-lg font-bold text-gray-900 mb-6" }, "\u0627\u0644\u0625\u064A\u0631\u0627\u062F\u0627\u062A \u0627\u0644\u064A\u0648\u0645\u064A\u0629 (\u0622\u062E\u0631 7 \u0623\u064A\u0627\u0645)"), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-end gap-3 h-48" }, dailyRevenue.map((day, i2) => /* @__PURE__ */ import_react38.default.createElement("div", { key: i2, className: "flex-1 flex flex-col items-center gap-2" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-xs text-gray-500 font-medium" }, day.revenue > 0 ? `${day.revenue}` : ""), /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-full relative flex items-end", style: { height: "140px" } }, /* @__PURE__ */ import_react38.default.createElement(
    "div",
    {
      className: "w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-500",
      style: {
        height: `${Math.max(day.revenue / maxRevenue * 100, day.revenue > 0 ? 5 : 0)}%`
      }
    }
  )), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-xs text-gray-500" }, day.label))))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("h3", { className: "text-lg font-bold text-gray-900 mb-6" }, "\u062A\u0648\u0632\u064A\u0639 \u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0637\u0644\u0628\u0627\u062A"), stats?.statusCounts ? /* @__PURE__ */ import_react38.default.createElement("div", { className: "space-y-3" }, [
    { key: "delivered", label: "\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644", color: "bg-green-500" },
    { key: "pending", label: "\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631", color: "bg-yellow-500" },
    { key: "preparing", label: "\u0642\u064A\u062F \u0627\u0644\u062A\u062D\u0636\u064A\u0631", color: "bg-purple-500" },
    { key: "delivering", label: "\u0642\u064A\u062F \u0627\u0644\u062A\u0648\u0635\u064A\u0644", color: "bg-orange-500" },
    { key: "cancelled", label: "\u0645\u0644\u063A\u064A", color: "bg-red-500" },
    { key: "confirmed", label: "\u0645\u0624\u0643\u062F", color: "bg-blue-500" }
  ].map(({ key, label, color }) => {
    const count = stats.statusCounts[key] || 0;
    const pct = stats.totalOrders > 0 ? count / stats.totalOrders * 100 : 0;
    return /* @__PURE__ */ import_react38.default.createElement("div", { key }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: `w-3 h-3 rounded-full ${color}` }), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-700" }, label)), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm font-bold text-gray-900" }, count, " (", pct.toFixed(1), "%)")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-full bg-gray-100 rounded-full h-2" }, /* @__PURE__ */ import_react38.default.createElement(
      "div",
      {
        className: `h-2 rounded-full ${color} transition-all duration-500`,
        style: { width: `${pct}%` }
      }
    )));
  })) : /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center justify-center h-40" }, /* @__PURE__ */ import_react38.default.createElement(RefreshCw, { className: "w-6 h-6 text-gray-400 animate-spin" })))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("h3", { className: "text-lg font-bold text-gray-900 mb-6" }, "\u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u062A\u0627\u062C\u0631 \u0623\u062F\u0627\u0621\u064B"), topStores.length === 0 ? /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-400 text-center py-8" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A") : /* @__PURE__ */ import_react38.default.createElement("div", { className: "space-y-4" }, topStores.map((store, i2) => /* @__PURE__ */ import_react38.default.createElement("div", { key: store._id, className: "flex items-center gap-4" }, /* @__PURE__ */ import_react38.default.createElement(
    "div",
    {
      className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${i2 === 0 ? "bg-yellow-500" : i2 === 1 ? "bg-gray-400" : i2 === 2 ? "bg-orange-400" : "bg-purple-200 text-purple-700"}`
    },
    i2 + 1
  ), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex-1" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: "font-semibold text-gray-900" }, store.nameAr), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, store.totalOrders, " \u0637\u0644\u0628")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-full bg-gray-100 rounded-full h-2" }, /* @__PURE__ */ import_react38.default.createElement(
    "div",
    {
      className: "h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500",
      style: {
        width: `${topStores[0].totalOrders > 0 ? store.totalOrders / topStores[0].totalOrders * 100 : 0}%`
      }
    }
  ))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "text-right" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ import_react38.default.createElement(Star, { className: "w-3 h-3 text-yellow-400" }), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm font-medium text-gray-700" }, store.rating.toFixed(1)))))))));
}
function StatCard({
  icon,
  title,
  value,
  sub,
  color,
  trend
}) {
  const colors = {
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600"
  };
  return /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center justify-between mb-3 sm:mb-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: `w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors[color]} flex items-center justify-center` }, icon), trend === "up" ? /* @__PURE__ */ import_react38.default.createElement(ArrowUpRight, { className: "w-4 h-4 sm:w-5 sm:h-5 text-green-500" }) : /* @__PURE__ */ import_react38.default.createElement(ArrowDownRight, { className: "w-4 h-4 sm:w-5 sm:h-5 text-red-500" })), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-xs sm:text-sm text-gray-500 mb-1" }, title), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-xl sm:text-2xl font-bold text-gray-900 mb-1" }, value), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-[10px] sm:text-xs text-gray-400" }, sub));
}
function KpiCard({
  title,
  value,
  icon,
  color
}) {
  const colors = {
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600"
  };
  return /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: `w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-4` }, icon), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-sm text-gray-500 mb-1" }, title), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-2xl font-bold text-gray-900" }, value));
}
function StatusBadge({ status }) {
  const map = {
    pending: { label: "\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631", cls: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "\u0645\u0624\u0643\u062F", cls: "bg-blue-100 text-blue-800" },
    assigned: { label: "\u062A\u0645 \u0627\u0644\u062A\u0639\u064A\u064A\u0646", cls: "bg-indigo-100 text-indigo-800" },
    preparing: { label: "\u0642\u064A\u062F \u0627\u0644\u062A\u062D\u0636\u064A\u0631", cls: "bg-purple-100 text-purple-800" },
    ready: { label: "\u062C\u0627\u0647\u0632", cls: "bg-teal-100 text-teal-800" },
    picked_up: { label: "\u062A\u0645 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645", cls: "bg-cyan-100 text-cyan-800" },
    delivering: { label: "\u0642\u064A\u062F \u0627\u0644\u062A\u0648\u0635\u064A\u0644", cls: "bg-orange-100 text-orange-800" },
    delivered: { label: "\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644", cls: "bg-green-100 text-green-800" },
    cancelled: { label: "\u0645\u0644\u063A\u064A", cls: "bg-red-100 text-red-800" }
  };
  const s2 = map[status] || { label: status, cls: "bg-gray-100 text-gray-800" };
  return /* @__PURE__ */ import_react38.default.createElement("span", { className: `px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${s2.cls}` }, s2.label);
}
function UsersManagement() {
  const users = useQuery(api.admin.getAllUsers);
  const suspendUser = useMutation(api.admin.suspendUser);
  const deleteUser = useMutation(api.admin.deleteUser);
  const [searchTerm, setSearchTerm] = (0, import_react38.useState)("");
  const [filterRole, setFilterRole] = (0, import_react38.useState)(null);
  const [filterStatus, setFilterStatus] = (0, import_react38.useState)(null);
  const filteredUsers = (users || []).filter((u2) => filterRole === null || u2.role === filterRole).filter((u2) => filterStatus === null || filterStatus === "active" && !u2.isSuspended || filterStatus === "suspended" && u2.isSuspended).filter(
    (u2) => !searchTerm || u2.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || u2.email?.toLowerCase().includes(searchTerm.toLowerCase()) || u2.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSuspendUser = async (userId, currentStatus) => {
    try {
      await suspendUser({
        userId,
        isSuspended: !currentStatus
      });
      n2.success(!currentStatus ? "\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645" : "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645");
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645");
    }
  };
  const handleDeleteUser = async (userId) => {
    if (!confirm("\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u061F \u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621 \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646\u0647.")) {
      return;
    }
    try {
      await deleteUser({ userId });
      n2.success("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645");
    } catch (error) {
      n2.error(error instanceof Error ? error.message : "\u0641\u0634\u0644 \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645");
    }
  };
  const roles = [
    { key: null, label: "\u0627\u0644\u0643\u0644" },
    { key: "customer", label: "\u0639\u0645\u0644\u0627\u0621" },
    { key: "merchant", label: "\u062A\u062C\u0627\u0631" },
    { key: "captain", label: "\u0643\u0628\u0627\u062A\u0646" },
    { key: "admin", label: "\u0645\u062F\u064A\u0631\u0648\u0646" }
  ];
  const statuses = [
    { key: null, label: "\u0627\u0644\u0643\u0644" },
    { key: "active", label: "\u0646\u0634\u0637" },
    { key: "suspended", label: "\u0645\u0648\u0642\u0648\u0641" }
  ];
  const roleLabels = {
    customer: "\u0639\u0645\u064A\u0644",
    merchant: "\u062A\u0627\u062C\u0631",
    captain: "\u0643\u0627\u0628\u062A\u0646",
    admin: "\u0645\u062F\u064A\u0631"
  };
  return /* @__PURE__ */ import_react38.default.createElement("div", { className: "p-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react38.default.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-500 mt-1" }, users ? `${users.length} \u0645\u0633\u062A\u062E\u062F\u0645 \u0625\u062C\u0645\u0627\u0644\u0627\u064B` : "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(Users, { className: "w-5 h-5 text-blue-600" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, users?.length ?? "\u2014")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(UserCheck, { className: "w-5 h-5 text-green-600" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0627\u0644\u0639\u0645\u0644\u0627\u0621")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, users?.filter((u2) => u2.role === "customer").length ?? "\u2014")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(Store, { className: "w-5 h-5 text-orange-600" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0627\u0644\u062A\u062C\u0627\u0631")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, users?.filter((u2) => u2.role === "merchant").length ?? "\u2014")), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement(CircleX, { className: "w-5 h-5 text-red-600" })), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-500" }, "\u0627\u0644\u0645\u0648\u0642\u0648\u0641\u0648\u0646")), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-3xl font-bold text-gray-900" }, users?.filter((u2) => u2.isSuspended).length ?? "\u2014"))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex flex-col lg:flex-row gap-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ import_react38.default.createElement(Search, { className: "absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-gray-400" }), /* @__PURE__ */ import_react38.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u0627\u0628\u062D\u062B \u0628\u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0627\u0644\u0628\u0631\u064A\u062F \u0623\u0648 \u0627\u0644\u0647\u0627\u062A\u0641...",
      value: searchTerm,
      onChange: (e2) => setSearchTerm(e2.target.value),
      className: "w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
    }
  )), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex gap-2 overflow-x-auto" }, roles.map(({ key, label }) => /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      key: String(key),
      onClick: () => setFilterRole(key),
      className: `px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${filterRole === key ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`
    },
    label
  ))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex gap-2 overflow-x-auto" }, statuses.map(({ key, label }) => /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      key: String(key),
      onClick: () => setFilterStatus(key),
      className: `px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${filterStatus === key ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`
    },
    label
  ))))), /* @__PURE__ */ import_react38.default.createElement("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react38.default.createElement("table", { className: "w-full" }, /* @__PURE__ */ import_react38.default.createElement("thead", { className: "bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200" }, /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u0645\u0648\u0628\u0627\u064A\u0644"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u062F\u0648\u0631"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u062D\u0627\u0644\u0629"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0627\u0644\u062A\u0633\u062C\u064A\u0644"), /* @__PURE__ */ import_react38.default.createElement("th", { className: "px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase" }, "\u0625\u062C\u0631\u0627\u0621\u0627\u062A"))), /* @__PURE__ */ import_react38.default.createElement("tbody", { className: "divide-y divide-gray-100" }, !users ? /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("td", { colSpan: 6, className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react38.default.createElement(RefreshCw, { className: "w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" }), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-400" }, "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644..."))) : filteredUsers.length === 0 ? /* @__PURE__ */ import_react38.default.createElement("tr", null, /* @__PURE__ */ import_react38.default.createElement("td", { colSpan: 6, className: "px-6 py-12 text-center" }, /* @__PURE__ */ import_react38.default.createElement(Users, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-gray-400 font-medium" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646"))) : filteredUsers.map((user) => /* @__PURE__ */ import_react38.default.createElement("tr", { key: user._id, className: "hover:bg-gray-50 transition-colors" }, /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm font-bold text-purple-700" }, user.fullName?.charAt(0)?.toUpperCase() || "U")), /* @__PURE__ */ import_react38.default.createElement("div", null, /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-sm font-semibold text-gray-900" }, user.fullName || "\u2014"), /* @__PURE__ */ import_react38.default.createElement("p", { className: "text-xs text-gray-500" }, user.email || "\u2014")))), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4" }, user.phone ? /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react38.default.createElement(Phone, { className: "w-4 h-4 text-blue-500" }), /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm font-medium text-gray-900" }, user.phone)) : /* @__PURE__ */ import_react38.default.createElement("span", { className: "text-sm text-gray-400" }, "\u2014")), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: `px-2 py-1 rounded-lg text-xs font-semibold ${user.role === "admin" ? "bg-purple-100 text-purple-700" : user.role === "merchant" ? "bg-orange-100 text-orange-700" : user.role === "captain" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}` }, roleLabels[user.role] || user.role)), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react38.default.createElement("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${user.isSuspended ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}` }, user.isSuspended ? "\u0645\u0648\u0642\u0648\u0641" : "\u0646\u0634\u0637")), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4 text-xs text-gray-500" }, new Date(user._creationTime).toLocaleDateString("ar-EG")), /* @__PURE__ */ import_react38.default.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ import_react38.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      onClick: () => handleSuspendUser(user._id, user.isSuspended || false),
      className: `text-xs px-2 py-1 rounded-lg font-medium transition-colors ${user.isSuspended ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`
    },
    user.isSuspended ? "\u062A\u0641\u0639\u064A\u0644" : "\u0625\u064A\u0642\u0627\u0641"
  ), user.role !== "admin" && /* @__PURE__ */ import_react38.default.createElement(
    "button",
    {
      onClick: () => handleDeleteUser(user._id),
      className: "text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors"
    },
    "\u062D\u0630\u0641"
  ))))))))));
}
export {
  AdminDashboard as default
};
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/mergeClasses.js:
lucide-react/dist/esm/shared/src/utils/toKebabCase.js:
lucide-react/dist/esm/shared/src/utils/toCamelCase.js:
lucide-react/dist/esm/shared/src/utils/toPascalCase.js:
lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.js:
lucide-react/dist/esm/Icon.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/activity.js:
lucide-react/dist/esm/icons/arrow-down-right.js:
lucide-react/dist/esm/icons/arrow-right.js:
lucide-react/dist/esm/icons/arrow-up-right.js:
lucide-react/dist/esm/icons/bell.js:
lucide-react/dist/esm/icons/calendar.js:
lucide-react/dist/esm/icons/chart-column.js:
lucide-react/dist/esm/icons/circle-alert.js:
lucide-react/dist/esm/icons/circle-check-big.js:
lucide-react/dist/esm/icons/circle-x.js:
lucide-react/dist/esm/icons/clock.js:
lucide-react/dist/esm/icons/credit-card.js:
lucide-react/dist/esm/icons/crown.js:
lucide-react/dist/esm/icons/database.js:
lucide-react/dist/esm/icons/dollar-sign.js:
lucide-react/dist/esm/icons/download.js:
lucide-react/dist/esm/icons/eye-off.js:
lucide-react/dist/esm/icons/eye.js:
lucide-react/dist/esm/icons/file-text.js:
lucide-react/dist/esm/icons/globe.js:
lucide-react/dist/esm/icons/house.js:
lucide-react/dist/esm/icons/info.js:
lucide-react/dist/esm/icons/key.js:
lucide-react/dist/esm/icons/layout-dashboard.js:
lucide-react/dist/esm/icons/loader-circle.js:
lucide-react/dist/esm/icons/lock.js:
lucide-react/dist/esm/icons/log-out.js:
lucide-react/dist/esm/icons/mail.js:
lucide-react/dist/esm/icons/map-pin.js:
lucide-react/dist/esm/icons/package.js:
lucide-react/dist/esm/icons/phone.js:
lucide-react/dist/esm/icons/plus.js:
lucide-react/dist/esm/icons/power.js:
lucide-react/dist/esm/icons/printer.js:
lucide-react/dist/esm/icons/refresh-cw.js:
lucide-react/dist/esm/icons/save.js:
lucide-react/dist/esm/icons/search.js:
lucide-react/dist/esm/icons/send.js:
lucide-react/dist/esm/icons/settings.js:
lucide-react/dist/esm/icons/shield.js:
lucide-react/dist/esm/icons/shopping-bag.js:
lucide-react/dist/esm/icons/shopping-cart.js:
lucide-react/dist/esm/icons/square-pen.js:
lucide-react/dist/esm/icons/star.js:
lucide-react/dist/esm/icons/store.js:
lucide-react/dist/esm/icons/tag.js:
lucide-react/dist/esm/icons/trash-2.js:
lucide-react/dist/esm/icons/trending-up.js:
lucide-react/dist/esm/icons/triangle-alert.js:
lucide-react/dist/esm/icons/truck.js:
lucide-react/dist/esm/icons/user-check.js:
lucide-react/dist/esm/icons/user.js:
lucide-react/dist/esm/icons/users.js:
lucide-react/dist/esm/icons/wallet.js:
lucide-react/dist/esm/icons/x.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.563.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

react-router/dist/development/chunk-JZWAC4HX.mjs:
react-router/dist/development/index.mjs:
  (**
   * react-router v7.13.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)
*/
